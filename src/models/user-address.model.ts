import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User, UserWithRelations} from './user.model';

@model()
export class UserAddress extends Entity {
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
  address: string;

  @property({
    type: 'number',
    default: 0,
  })
  nonce?: number;

  @belongsTo(() => User, {}, {mongodb: {dataType: 'ObjectId'}})
  userId?: string;

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

  constructor(data?: Partial<UserAddress>) {
    super(data);
  }
}

export interface UserAddressRelations {
  user?: UserWithRelations;
}

export type UserAddressWithRelations = UserAddress & UserAddressRelations;
