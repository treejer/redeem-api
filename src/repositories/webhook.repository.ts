import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Webhook, WebhookRelations} from '../models';

export class WebhookRepository extends DefaultCrudRepository<
  Webhook,
  typeof Webhook.prototype._id,
  WebhookRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Webhook, dataSource);
  }
}
