import {RequestBodyObject, ResponseObject} from '@loopback/rest';

export const GET_NONCE_RESPONSE: ResponseObject = {
  description: 'Gets a message including a random nonce to be signed by user',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'NonceResponse',
        properties: {
          message: {type: 'string'},
        },
      },
    },
  },
};

export const GET_NONCE_RESPONSE_BADREQUEST: ResponseObject = {
  description: 'Address is not passed or invalid address',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'NonceResponseBadRequest',
        properties: {
          message: {type: 'string'},
        },
      },
    },
  },
};

export const GET_NONCE_REQUEST: RequestBodyObject = {
  required: false,
  description:
    'Accepts a variable named {address} [public address of user] in query params',
  content: {},
};

export const SIGN_MESSAGE_REQUEST: RequestBodyObject = {
  required: true,
  description:
    'Accepts a variable named {address} [public address of user] in query params',
  content: {
    'application/json': {
      signature: {type: 'string'},
    },
  },
};
export interface SignMessageRequestBody {
  signature: string;
}
