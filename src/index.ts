import {ApplicationConfig} from './application';
import {app, config} from './AppSingleton';
require('dotenv').config();

export * from './application';
export * from './AppSingleton';
export async function main(options: ApplicationConfig = {}) {
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  // console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
