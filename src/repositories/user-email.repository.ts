import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserEmail, UserEmailRelations} from '../models';

export class UserEmailRepository extends DefaultCrudRepository<
  UserEmail,
  typeof UserEmail.prototype._id,
  UserEmailRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserEmail, dataSource);
  }
}
