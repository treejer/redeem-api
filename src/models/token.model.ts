import {belongsTo, Entity, model, property} from '@loopback/repository';
import {AccessToken} from './access-token.model';

@model()
export class Token extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @belongsTo(() => AccessToken, {}, {})
  accessTokenId: string;

  constructor(data?: Partial<Token>) {
    super(data);
  }
}

export interface TokenRelations {
  // describe navigational properties here
  accessToken: AccessToken;
}

export type TokenWithRelations = Token & TokenRelations;
