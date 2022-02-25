import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {LoginToken, LoginTokenRelations} from '../models';

export class LoginTokenRepository extends DefaultCrudRepository<
  LoginToken,
  typeof LoginToken.prototype._id,
  LoginTokenRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LoginToken, dataSource);
  }
}
