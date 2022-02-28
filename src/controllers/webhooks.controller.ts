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
  get,
  getModelSchemaRef,
  param,
  post,
  put,
  Request,
  requestBody,
  Response,
  response as responseSpec,
  RestBindings,
} from '@loopback/rest';
import {endResponse, userAuthentication} from '../core/utils';
import {Webhook, WebhookStatus} from '../models';
import {AccessTokenRepository, WebhookRepository} from '../repositories';

export class WebhooksController {
  constructor(
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) public response: Response,

    @repository(WebhookRepository)
    public webhookRepository: WebhookRepository,
    @repository(AccessTokenRepository)
    public accessTokenRepository: AccessTokenRepository,
  ) {}

  @post('/access-tokens/{accessTokenId}/webhooks')
  @responseSpec(200, {
    description: 'Webhook model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Webhook, {
          title: 'NewWebhook',
          exclude: ['_id', 'accessTokenId', 'updatedAt', 'createdAt', 'status'],
        }),
      },
    },
  })
  async create(
    @param.path.string('accessTokenId') accessTokenId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Webhook, {
            title: 'NewWebhook',
            exclude: [
              '_id',
              'accessTokenId',
              'updatedAt',
              'createdAt',
              'status',
            ],
          }),
        },
      },
    })
    webhook: Omit<Webhook, '_id'>,
  ): Promise<Webhook | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const accessToken = await this.accessTokenRepository.findById(
      accessTokenId,
    );
    if (!accessToken || accessToken.userId !== user._id) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No access tokens with given ID',
      );
    }
    webhook.createdAt = new Date();
    webhook.updatedAt = new Date();
    webhook.accessTokenId = accessTokenId;
    webhook.status = WebhookStatus.CREATED;
    return this.webhookRepository.create(webhook);
  }

  @get('/access-tokens/{accessTokenId}/webhooks/count')
  @responseSpec(200, {
    description: 'Webhook model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.path.string('accessTokenId') accessTokenId: string,
    @param.where(Webhook) where?: Where<Webhook>,
  ): Promise<Count | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const accessToken = await this.accessTokenRepository.findById(
      accessTokenId,
    );
    if (!accessToken || accessToken.userId !== user._id) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No access tokens with given ID',
      );
    }
    return this.webhookRepository.count({...(where ?? {}), accessTokenId});
  }

  @get('/access-tokens/{accessTokenId}/webhooks')
  @responseSpec(200, {
    description: 'Array of Webhook model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Webhook, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('accessTokenId') accessTokenId: string,
    @param.filter(Webhook) filter?: Filter<Webhook>,
  ): Promise<Webhook[] | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const accessToken = await this.accessTokenRepository.findById(
      accessTokenId,
    );
    if (!accessToken || accessToken.userId !== user._id) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No access tokens with given ID',
      );
    }
    return this.webhookRepository.find({
      ...(filter ?? {}),
      where: {...(filter?.where ?? {}), accessTokenId},
    });
  }

  @get('/access-tokens/{accessTokenId}/webhooks/{id}')
  @responseSpec(200, {
    description: 'Webhook model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Webhook, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('accessTokenId') accessTokenId: string,
    @param.path.string('id') id: string,
    @param.filter(Webhook, {exclude: 'where'})
    filter?: FilterExcludingWhere<Webhook>,
  ): Promise<Webhook | void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const accessToken = await this.accessTokenRepository.findById(
      accessTokenId,
    );
    if (!accessToken || accessToken.userId !== user._id) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No access tokens with given ID',
      );
    }
    return this.webhookRepository.findById(id, filter);
  }

  @put('/access-tokens/{accessTokenId}/webhooks/{id}')
  @responseSpec(204, {
    description: 'Webhook PUT success',
  })
  @responseSpec(404, {
    description: 'No webhooks or accessTokens found',
  })
  async replaceById(
    @param.path.string('accessTokenId') accessTokenId: string,
    @param.path.string('id') id: string,
    @requestBody() webhook: Webhook,
  ): Promise<void> {
    const user = userAuthentication.bind(this)();
    if (!user) return;
    const accessToken = await this.accessTokenRepository.findById(
      accessTokenId,
    );
    if (!accessToken || accessToken.userId !== user._id) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No access tokens with given ID',
      );
    }
    const prevWebhook = await this.webhookRepository.findById(
      ({_id: id} as Webhook)._id,
    );

    if (!prevWebhook) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No webhooks could be found with given ID',
      );
    }
    webhook.updatedAt = new Date();
    webhook.createdAt = prevWebhook.createdAt;
    webhook.accessTokenId = accessTokenId;
    webhook.status = WebhookStatus.CREATED;
    await this.webhookRepository.replaceById(id, webhook);
  }
}
