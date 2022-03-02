import {Request, Response} from '@loopback/rest';
import {AccessToken} from '../../models';
import {AccessTokenRepository} from './../../repositories/access-token.repository';
import {endResponse} from './endResponse';

interface Scope {
  request: Request;
  response: Response;
  accessTokenRepository: AccessTokenRepository;
}
export async function tokenAuthentication(
  this: Scope,
): Promise<AccessToken | void> {
  if (typeof this.request.headers.authorization !== 'string') {
    return endResponse.bind(this)(
      401,
      'Authentication Required',
      "'Authorization' header must be sent and be a valid token",
    );
  }
  const token = this.request.headers.authorization;
  const accessToken = await this.accessTokenRepository.findOne({
    where: {token},
  });
  if (!accessToken) {
    return endResponse.bind(this)(
      401,
      'Authentication Required',
      "'Authorization' header must be sent and be a valid token",
    );
  }
  return accessToken;
}
