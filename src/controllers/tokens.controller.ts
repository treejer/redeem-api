import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  Request,
  requestBody,
  Response,
  response as responseSpec,
  RestBindings,
} from '@loopback/rest';
import {tokenAuthentication} from '../core/utils';
import {Token} from '../models';
import {AccessTokenRepository, TokenRepository} from '../repositories';

export class TokensController {
  constructor(
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) public response: Response,

    @repository(TokenRepository)
    public tokenRepository: TokenRepository,
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
  ) {}

  @post('/tokens')
  @responseSpec(200, {
    description: 'Token model instance',
    content: {'application/json': {schema: getModelSchemaRef(Token)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Token, {
            title: 'NewToken',
            exclude: ['_id', 'accessTokenId'],
          }),
        },
      },
    })
    token: Omit<Token, '_id'>,
  ): Promise<Token | void> {
    const accessToken = await tokenAuthentication.bind(this)();
    if (!accessToken) return;
    return this.tokenRepository.create({
      ...token,
      accessTokenId: accessToken._id,
    });
  }

  @get('/tokens/count')
  @responseSpec(200, {
    description: 'Token model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Token) where?: Where<Token>): Promise<Count | void> {
    const accessToken = await tokenAuthentication.bind(this)();
    if (!accessToken) return;
    Object.assign((where ?? {}) as Object, {accessTokenId: accessToken._id});
    return this.tokenRepository.count(where);
  }

  @get('/tokens')
  @responseSpec(200, {
    description: 'Array of Token model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Token, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Token) filter?: Filter<Token>,
  ): Promise<Token[] | void> {
    const accessToken = await tokenAuthentication.bind(this)();
    if (!accessToken) return;
    Object.assign((filter?.where ?? {}) as Object, {
      accessTokenId: accessToken._id,
    });
    return this.tokenRepository.find(filter);
  }
}
