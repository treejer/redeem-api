import {Response} from '@loopback/rest';
import {apiResponse} from '../../models';

interface Scope {
  response: Response;
}

export function endResponse(
  this: Scope,
  statusCode: number,
  statusMessage: string,
  message?: string,
  data?: object,
): void {
  this.response.writeHead(statusCode, statusMessage, {
    'Content-Type': 'application/json',
  });
  const response = apiResponse(message ?? 'Done', data);
  this.response.end(JSON.stringify(response));
}
