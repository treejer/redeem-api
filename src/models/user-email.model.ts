import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';

@model()
export class UserEmail extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'},
  })
  _id?: string;

  @belongsTo(() => User, {}, {mongodb: {dataType: 'ObjectId'}})
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isVerified: boolean;

  @property({
    type: 'date',
    required: true,
  })
  sentAt: Date;

  @property({
    type: 'date',
  })
  verifiedAt?: Date;

  constructor(data?: Partial<UserEmail>) {
    super(data);
  }
}

export interface UserEmailRelations {
  userId: UserWithRelations;
}

export type UserEmailWithRelations = UserEmail & UserEmailRelations;
