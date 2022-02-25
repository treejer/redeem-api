import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {TwilioConnector} from 'loopback-connector-twilio-ts';
require('dotenv').config();

const config = {
  name: 'twilio',
  connector: TwilioConnector,
  accountSid: process.env.TWILIO_SID ?? '',
  authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
};

@lifeCycleObserver('datasource')
export class TwilioDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'twilio';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.twilio', {optional: true})
    dsConfig: object = config,
  ) {
    super('twilio', dsConfig);
  }
}
