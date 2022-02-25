import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserAddress, UserAddressRelations} from '../models';

export class UserAddressRepository extends DefaultCrudRepository<
  UserAddress,
  typeof UserAddress.prototype._id,
  UserAddressRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserAddress, dataSource);
  }
}
