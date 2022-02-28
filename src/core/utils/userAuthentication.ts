import {Request, Response} from '@loopback/rest';
import {User} from '../../models';
import {endResponse} from './endResponse';
import {decryptJWT} from './jwt';

interface Scope {
  request: Request;
  response: Response;
}
export function userAuthentication(this: Scope): User | void {
  const token =
    typeof this.request.headers.token === 'string'
      ? this.request.headers.token
      : '';
  const user = decryptJWT(token);
  if (!user) {
    endResponse.bind(this)(
      401,
      'Authentication Required',
      "'token' header must be sent and be a valid token",
    );
  }
  return user;
}
