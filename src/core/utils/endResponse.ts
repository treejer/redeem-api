import {Response} from '@loopback/rest';
import {apiResponse} from '../../models';

interface Scope {
  res: Response;
}

export function endResponse(
  this: Scope,
  statusCode: number,
  statusMessage: string,
  message?: string,
  data?: object,
) {
  this.res.writeHead(statusCode, statusMessage, {
    'Content-Type': 'application/json',
  });
  this.res.end(JSON.stringify(apiResponse(message ?? 'Done', data)));
}
