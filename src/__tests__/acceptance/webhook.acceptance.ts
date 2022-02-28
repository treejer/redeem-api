import {Client, supertest} from '@loopback/testlab';
import {TreejerApiApplication} from '../..';
import {createJWT} from '../../core/utils';
import {AccessToken, User, Webhook} from './../../models';
// import {User} from './../../models/';
import {AccessTokenRepository, WebhookRepository} from './../../repositories';
import {setupApplication} from './test-helper';

describe('Webhooks', () => {
  let app: TreejerApiApplication;
  let client: Client;
  const jwt = createJWT({_id: 'TEMP_USER'} as User, '1d');
  const t1 = new AccessToken({token: 'abcdefghi'});
  let accessToken: AccessToken;
  let accessTokenRepo: AccessTokenRepository;
  let webhook: Webhook;
  let webhookRepo: WebhookRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    accessTokenRepo = await app.get('repositories.AccessTokenRepository');
    webhookRepo = await app.get('repositories.WebhookRepository');
    await accessTokenRepo.deleteAll();
    await webhookRepo.deleteAll();
    await client
      .post('/access-tokens')
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .send(t1)
      .expect(200)
      .then(res => (accessToken = res.body));
    webhook = new Webhook({url: 'https://example.com/v1/redeem/'});
  });

  after(async () => {
    await app.stop();
  });

  it('Sets a new webhook for given access token', async () => {
    await client
      .post(`/access-tokens/${accessToken._id}/webhooks/`)
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .send(webhook)
      .expect(200)
      .then(res => (webhook = res.body));
  });

  it('Returns number of webhooks of an access token', async () => {
    await client
      .get(`/access-tokens/${accessToken._id}/webhooks/count`)
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .expect(200)
      .expect({count: 1});
  });

  it('Returns all of webhooks of an access token', async () => {
    await client
      .get(`/access-tokens/${accessToken._id}/webhooks`)
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .expect(200)
      .expect((res: supertest.Response) => {
        return res.body.length === 1 && res.body[0].url === webhook.url;
      });
  });

  it('Updates a webhook', async () => {
    webhook.url = 'https://nexample.com/v2/redeem/';
    await client
      .put(`/access-tokens/${accessToken._id}/webhooks/${webhook._id}`)
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .send(webhook)
      .expect(204);
    await client
      .get(`/access-tokens/${accessToken._id}/webhooks/${webhook._id}`)
      .set('Content-Type', 'application/json')
      .set('token', jwt)
      .expect(200)
      .expect((res: supertest.Response) => {
        return res.body.url === webhook.url;
      });
  });
});
