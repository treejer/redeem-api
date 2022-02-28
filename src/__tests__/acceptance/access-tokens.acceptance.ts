import {Client, supertest} from '@loopback/testlab';
import {TreejerApiApplication} from '../..';
import {createJWT} from '../../core/utils';
import {AccessToken} from './../../models';
import {User} from './../../models/user.model';
import {AccessTokenRepository} from './../../repositories/access-token.repository';
import {setupApplication} from './test-helper';

describe('AccessTokens', () => {
  let app: TreejerApiApplication;
  let client: Client;
  const jwt = createJWT({_id: 'TEMP_USER'} as User, '1d');
  const t1 = new AccessToken({token: 'abcdefghi'});
  const accessTokens: AccessToken[] = [];
  let accessTokenRepo: AccessTokenRepository;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    accessTokenRepo = await app.get('repositories.AccessTokenRepository');
    await accessTokenRepo.deleteAll();
  });

  after(async () => {
    await app.stop();
  });

  it('checks user authentication token', async () => {
    await client
      .post('/access-tokens')
      .set('Content-Type', 'application/json')
      .set('token', '')
      .send(t1)
      .expect(401);
  });

  it('Takes a parameter "token" and insert a document to database', async () => {
    await client
      .post('/access-tokens')
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .send(t1)
      .expect(200)
      .then(res => accessTokens.push(res.body));
  });

  it('Returns number of tokens created by user', async () => {
    await client
      .get('/access-tokens/count')
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .expect(200)
      .expect({count: 1});
  });

  it('Returns all of tokens created by user', async () => {
    await client
      .get('/access-tokens')
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .expect(200)
      .expect((res: supertest.Response) => {
        return (
          res.body.length === 1 && res.body[0].token === accessTokens[0].token
        );
      });
  });

  it('Updates the token value', async () => {
    accessTokens[0].token = 'zxcvbnnmmm';
    await client
      .patch('/access-tokens/')
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .send(accessTokens[0])
      .expect(200)
      .expect((res: supertest.Response) => {
        return (
          res.body.length === 1 && res.body[0].token === accessTokens[0].token
        );
      });
  });

  it('Deletes a token', async () => {
    await client
      .del('/access-tokens/' + accessTokens[0]._id)
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .expect(204)
      .expect((res: supertest.Response) => {
        return (
          res.body.length === 1 && res.body[0].token === accessTokens[0].token
        );
      });
  });
});
