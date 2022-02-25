import {TreejerApiApplication} from './application';

const config = {
  rest: {
    port: +(process.env.PORT ?? 3000),
    host: process.env.HOST,
    gracePeriodForClose: 5000, // 5 seconds
    openApiSpec: {
      setServersFromRequest: true,
    },
  },
};
const app = new TreejerApiApplication(config);
export {app, config};
