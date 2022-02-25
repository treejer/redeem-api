import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserMobile, UserMobileRelations} from '../models';

export class UserMobileRepository extends DefaultCrudRepository<
  UserMobile,
  typeof UserMobile.prototype._id,
  UserMobileRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserMobile, dataSource);
  }
}
