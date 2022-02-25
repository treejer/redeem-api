import {Request} from '@loopback/rest';
import {User} from '../../models';
import {decryptJWT} from './jwt';

export function userAuthentication(this: Request): User | void {
  const token =
    typeof this.headers.token === 'string' ? this.headers.token : '';
  const user = decryptJWT(token);
  return user;
}
