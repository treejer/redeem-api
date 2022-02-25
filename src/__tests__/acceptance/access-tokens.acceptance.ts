import {Client} from '@loopback/testlab';
import {TreejerApiApplication} from '../..';
import {AccessToken} from './../../models';
import {AccessTokenRepository} from './../../repositories/access-token.repository';
import {setupApplication} from './test-helper';

describe('AccessTokens', () => {
  let app: TreejerApiApplication;
  let client: Client;
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
      .set(
        'token',
        // ATTENTION: This must be JWT token in which the payload is a user object [only _id is required] signed with the token used in .enb
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNpbmEiLCJlbWFpbCI6ImFiY2RAZXhhbXBsZS5jb20iLCJfaWQiOiJhYmMiLCJpYXQiOjE2NDU4MDQ5NzIsImV4cCI6MTY1MTg1Mjk3Mn0.c3IFePPJe4Y7sk_YgCia_xHQmLSrYQdZO5Zu6diH9wY',
      )
      .send(t1)
      .expect(200);
  });

  it('Returns number of tokens created by user', async () => {
    await client
      .get('/access-tokens/count')
      .set('Content-Type', 'application/json')
      .set(
        'token',
        // ATTENTION: This must be JWT token in which the payload is a user object [only _id is required] signed with the token used in .enb
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNpbmEiLCJlbWFpbCI6ImFiY2RAZXhhbXBsZS5jb20iLCJfaWQiOiJhYmMiLCJpYXQiOjE2NDU4MDQ5NzIsImV4cCI6MTY1MTg1Mjk3Mn0.c3IFePPJe4Y7sk_YgCia_xHQmLSrYQdZO5Zu6diH9wY',
      )
      .expect(200)
      .expect({count: 1});
  });

  // it('Returns all of tokens created by user', async () => {
  //   await client
  //     .get('/access-tokens')
  //     .set('Content-Type', 'application/json')
  //     .set(
  //       'token',
  //       // ATTENTION: This must be JWT token in which the payload is a user object [only _id is required] signed with the token used in .enb
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNpbmEiLCJlbWFpbCI6ImFiY2RAZXhhbXBsZS5jb20iLCJfaWQiOiJhYmMiLCJpYXQiOjE2NDU4MDQ5NzIsImV4cCI6MTY1MTg1Mjk3Mn0.c3IFePPJe4Y7sk_YgCia_xHQmLSrYQdZO5Zu6diH9wY',
  //     )
  //     .expect(200)
  //     .expect((res: supertest.Response) => {
  //       console.log('res.body = ', res.body);

  //       return (
  //         res.body.length === 1 && res.body[0].token === accessTokens[0].token
  //       );
  //     });
  // });

  // it('Updates the token value', async () => {
  //   accessTokens[0].token = 'zxcvbnnmmm';
  //   await client
  //     .patch('/access-tokens')
  //     .set('Content-Type', 'application/json')
  //     .set(
  //       'token',
  //       // ATTENTION: This must be JWT token in which the payload is a user object [only _id is required] signed with the token used in .enb
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNpbmEiLCJlbWFpbCI6ImFiY2RAZXhhbXBsZS5jb20iLCJfaWQiOiJhYmMiLCJpYXQiOjE2NDU4MDQ5NzIsImV4cCI6MTY1MTg1Mjk3Mn0.c3IFePPJe4Y7sk_YgCia_xHQmLSrYQdZO5Zu6diH9wY',
  //     )
  //     .send(accessTokens[0])
  //     .expect(200)
  //     .expect((res: supertest.Response) => {
  //       return (
  //         res.body.length === 1 && res.body[0].token === accessTokens[0].token
  //       );
  //     });
  // });
});
