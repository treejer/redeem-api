import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';

@model()
export class AccessToken extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @belongsTo(() => User, {}, {mongodb: {dataType: 'ObjectId'}})
  userId: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date;

  constructor(data?: Partial<AccessToken>) {
    super(data);
  }
}

export interface AccessTokenRelations {
  // describe navigational properties here
  user: UserWithRelations;
}

export type AccessTokenWithRelations = AccessToken & AccessTokenRelations;
