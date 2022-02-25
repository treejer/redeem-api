import {Entity, hasMany, model, property} from '@loopback/repository';
import {UserAddress} from './user-address.model';
import {UserEmail} from './user-email.model';
import {UserMobile} from './user-mobile.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'},
  })
  _id?: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  emailVerified: boolean;

  @property({
    type: 'string',
  })
  mobile?: string;

  @property({
    type: 'string',
  })
  mobileCountry?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  mobileVerified: boolean;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'date',
  })
  lastLoginAt?: Date;

  @property({
    type: 'date',
  })
  signedAt?: Date | null;

  @property({
    type: 'boolean',
  })
  isVerified?: boolean;

  @property({
    type: 'boolean',
  })
  isAdmin?: boolean;

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

  @hasMany(() => UserMobile, {keyFrom: 'userId'})
  mobiles: UserMobile[];

  @hasMany(() => UserAddress, {keyFrom: 'userId'})
  addresses: UserAddress[];

  @hasMany(() => UserEmail, {keyFrom: 'userId'})
  emails: UserEmail[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  mobiles: UserMobile[];
  emails: UserEmail[];
  addresses: UserAddress[];
}

export type UserWithRelations = User & UserRelations;
