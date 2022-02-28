import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  Request,
  requestBody,
  Response,
  response as responseSpec,
  RestBindings,
} from '@loopback/rest';
import {endResponse, generateToken, userAuthentication} from '../core/utils';
import {AccessToken} from '../models';
import {AccessTokenRepository} from '../repositories';

export class AccessTokensController {
  constructor(
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) public response: Response,

    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
  ) {}

  @post('/access-tokens')
  @responseSpec(201, {
    description: 'AccessToken model instance',
    content: {'application/json': {schema: getModelSchemaRef(AccessToken)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessToken, {
            title: 'NewAccessToken',
            exclude: ['_id', 'userId', 'date'],
          }),
        },
      },
    })
    accessToken: Omit<AccessToken, '_id'>,
  ): Promise<AccessToken | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;

    if (!accessToken.token) {
      accessToken.token = generateToken();
    }
    accessToken.date = new Date();
    accessToken.userId = user._id!;
    return this.accessTokenRepository.create(accessToken);
  }

  @get('/access-tokens/count')
  @responseSpec(200, {
    description: 'AccessToken model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AccessToken) where?: Where<AccessToken>,
  ): Promise<Count | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    return this.accessTokenRepository.count({
      ...where,
      userId: user._id!,
    });
  }

  @get('/access-tokens')
  @responseSpec(200, {
    description: 'Array of AccessToken model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AccessToken, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AccessToken) filter?: Filter<AccessToken>,
  ): Promise<AccessToken[] | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    if (!filter) filter = {};
    if (!filter.where) filter.where = {userId: user._id!};
    return this.accessTokenRepository.find({
      ...filter,
      where: {...filter.where, userId: user._id!},
    });
  }

  @patch('/access-tokens')
  @responseSpec(200, {
    description: 'AccessToken PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessToken, {partial: true}),
        },
      },
    })
    accessToken: AccessToken,
    @param.where(AccessToken) where?: Where<AccessToken>,
  ): Promise<Count | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    return this.accessTokenRepository.updateAll(
      {...accessToken, userId: user._id},
      where,
    );
  }

  @get('/access-tokens/{id}')
  @responseSpec(200, {
    description: 'AccessToken model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AccessToken, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(AccessToken, {exclude: 'where'})
    filter?: FilterExcludingWhere<AccessToken>,
  ): Promise<AccessToken | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const allTokens = await this.accessTokenRepository.find({
      ...filter,
      where: {userId: user._id!},
    });
    if (!allTokens || allTokens.length === 0) {
      return endResponse.bind(this)(404, 'Not Found', 'Token not found');
    }
    return allTokens[0];
  }

  @patch('/access-tokens/{id}')
  @responseSpec(204, {
    description: 'AccessToken PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AccessToken, {partial: true}),
        },
      },
    })
    accessToken: AccessToken,
  ): Promise<AccessToken | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    return this.accessTokenRepository.update(
      {_id: id, userId: user._id!} as AccessToken,
      accessToken,
    );
  }

  @del('/access-tokens/{id}')
  @responseSpec(204, {
    description: 'AccessToken DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const accessTokenOne = await this.accessTokenRepository.findById(id);
    if (accessTokenOne.userId !== user._id!) {
      return endResponse.bind(this)(404, 'Not Found', 'Token not found');
    }
    return endResponse.bind(this)(
      204,
      'Deleted',
      'Document deleted successfully',
    );
  }
}
