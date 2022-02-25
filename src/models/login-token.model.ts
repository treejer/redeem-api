import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class LoginToken extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: Date;

  @property({
    type: 'string',
  })
  ip?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<LoginToken>) {
    super(data);
  }
}

export interface LoginTokenRelations {
  // describe navigational properties here
}

export type LoginTokenWithRelations = LoginToken & LoginTokenRelations;
