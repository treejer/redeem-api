import {Request} from '@loopback/rest';
import {User} from '../../models';
import {decryptJWT} from './jwt';

export function userAuthentication(this: Request): User | void {
  const user = decryptJWT(this.headers.authorization ?? '');
  return user;
}
