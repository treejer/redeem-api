import {UserServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {createJWT} from './core/utils';
import {DbDataSource} from './datasources';
import {ErrorHandlerMiddlewareProvider} from './middlewares';
import {User} from './models';
import {MySequence} from './sequence';

require('dotenv').config();

const res = createJWT(
  {username: 'sina', email: 'abcd@example.com', _id: 'abc'} as User,
  '70d',
);
console.log('res = ', res);

export {ApplicationConfig};
export class TreejerApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(CronComponent);
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.add(createBindingFromClass(ErrorHandlerMiddlewareProvider));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
