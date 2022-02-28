import {belongsTo, Entity, model, property} from '@loopback/repository';
import {AccessToken} from './access-token.model';

export enum WebhookStatus {
  CREATED = 0,
  DELETED,
}
@model()
export class Webhook extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      enum: Object.values(WebhookStatus),
    },
  })
  status: number;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: Date;
  @belongsTo(() => AccessToken, {}, {})
  accessTokenId: string;

  constructor(data?: Partial<Webhook>) {
    super(data);
  }
}

export interface WebhookRelations {
  // describe navigational properties here
  accessToken: AccessToken;
}

export type WebhookWithRelations = Webhook & WebhookRelations;
