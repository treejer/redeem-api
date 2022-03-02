import {Client} from '@loopback/testlab';
import {TreejerApiApplication} from '../..';
import {createJWT} from '../../core/utils';
import {AccessToken, Token, User} from './../../models';
import {AccessTokenRepository, TokenRepository} from './../../repositories';
import {setupApplication} from './test-helper';

describe('Tokens', () => {
  let app: TreejerApiApplication;
  let client: Client;
  const jwt = createJWT({_id: 'TEMP_USER'} as User, '1d');
  const t1 = new AccessToken({token: 'abcdefghi'});
  let accessToken: AccessToken;
  let accessTokenRepo: AccessTokenRepository;
  let tokenRepo: TokenRepository;
  let token: Token;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    accessTokenRepo = await app.get('repositories.AccessTokenRepository');
    tokenRepo = await app.get('repositories.TokenRepository');
    await accessTokenRepo.deleteAll();
    await tokenRepo.deleteAll();
    await client
      .post('/access-tokens')
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .send(t1)
      .expect(200)
      .then(res => (accessToken = res.body));
    token = {
      email: 'user@example.com',
    } as Token;
  });

  after(async () => {
    await app.stop();
  });

  it('Inserts a new token', async () => {
    await client
      .post(`/tokens`)
      .set('Content-Type', 'application/json')
      .set('authorization', accessToken.token)
      .send(token)
      .expect(200)
      .then(res => (token = res.body));
  });

  it('Returns tokens count', async () => {
    await client
      .get(`/tokens/count`)
      .set('Content-Type', 'application/json')
      .set('authorization', accessToken.token)
      .expect(200)
      .expect({count: 1});
  });
});
