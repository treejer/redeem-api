import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';

@model()
export class UserMobile extends Entity {
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
  mobileNumber: string;

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

  constructor(data?: Partial<UserMobile>) {
    super(data);
  }
}

export interface UserMobileRelations {
  // describe navigational properties here
  user: UserWithRelations;
}

export type UserMobileWithRelations = UserMobile & UserMobileRelations;
