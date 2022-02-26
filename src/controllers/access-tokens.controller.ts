import {inject} from '@loopback/core';
import {
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
  response,
  RestBindings,
} from '@loopback/rest';
import {endResponse, generateToken, userAuthentication} from '../core/utils';
import {AccessToken} from '../models';
import {AccessTokenRepository} from '../repositories';

export class AccessTokensController {
  constructor(
    @inject(RestBindings.Http.REQUEST) public req: Request,
    @inject(RestBindings.Http.RESPONSE) public res: Response,

    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
  ) {}

  @post('/access-tokens')
  @response(201, {
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
  ) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );

    if (!accessToken.token) {
      accessToken.token = generateToken();
    }
    accessToken.date = new Date();
    accessToken.userId = user._id!;
    return this.accessTokenRepository.create(accessToken);
  }

  @get('/access-tokens/count')
  @response(200, {
    description: 'AccessToken model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(AccessToken) where?: Where<AccessToken>) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );
    return this.accessTokenRepository.count({
      ...where,
      userId: user._id!,
    });
  }

  @get('/access-tokens')
  @response(200, {
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
  async find(@param.filter(AccessToken) filter?: Filter<AccessToken>) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );
    if (!filter) filter = {};
    if (!filter.where) filter.where = {userId: user._id!};
    return this.accessTokenRepository.find({
      ...filter,
      where: {...filter.where, userId: user._id!},
    });
  }

  @patch('/access-tokens')
  @response(200, {
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
  ) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );
    return this.accessTokenRepository.updateAll(
      {...accessToken, userId: user._id},
      where,
    );
  }

  @get('/access-tokens/{id}')
  @response(200, {
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
  ) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );
    return this.accessTokenRepository.find({
      ...filter,
      where: {userId: user._id!},
    });
  }

  @patch('/access-tokens/{id}')
  @response(204, {
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
  ) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );

    await this.accessTokenRepository.update(
      {_id: id, userId: user._id!} as AccessToken,
      accessToken,
    );
  }

  @del('/access-tokens/{id}')
  @response(204, {
    description: 'AccessToken DELETE success',
  })
  async deleteById(@param.path.string('id') id: string) {
    const user = userAuthentication.bind(this.req)();
    if (!user)
      return endResponse.bind(this)(
        401,
        'Authentication Required',
        "'token' header must be sent and be a valid token",
      );
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
