// Uncomment these imports to begin using these cool features!
import {authenticate, TokenService} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  param,
  post,
  Request,
  requestBody,
  response,
  Response,
  RestBindings,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {
  GET_NONCE_REQUEST,
  GET_NONCE_RESPONSE,
  GET_NONCE_RESPONSE_BADREQUEST,
} from '../apispecs';
import {SIGN_MESSAGE_TEMPLATE} from '../core/constants';
import {
  checkAddress,
  createJWT,
  endResponse,
  generateNonce,
  recoverAddressfromSignature,
} from '../core/utils';
import {LoginToken, User} from '../models';
import {
  LoginTokenRepository,
  UserEmailRepository,
  UserMobileRepository,
  UserRepository as UserRepo,
} from '../repositories';
import {
  SignMessageRequestBody,
  SIGN_MESSAGE_REQUEST,
} from './../apispecs/users';
import {UserAddressRepository} from './../repositories/user-address.repository';

export class UserController {
  constructor(
    @inject(RestBindings.Http.REQUEST) public req: Request,
    @inject(RestBindings.Http.RESPONSE) public res: Response,
    @repository(UserRepo) public userRepo: UserRepo,
    @repository(UserAddressRepository)
    public userAddressRepository: UserAddressRepository,
    @repository(UserMobileRepository)
    public userMobileRepository: UserMobileRepository,
    @repository(UserEmailRepository)
    public userEmailRepository: UserEmailRepository,
    @repository(LoginTokenRepository)
    public loginTokenRepository: LoginTokenRepository,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/user/signup/nonce', {
    requestBody: GET_NONCE_REQUEST,
    responses: {
      '200': GET_NONCE_RESPONSE,
      '400': GET_NONCE_RESPONSE_BADREQUEST,
    },
  })
  @response(200, GET_NONCE_RESPONSE)
  @response(400, GET_NONCE_RESPONSE_BADREQUEST)
  async getNonce(
    @param.query.string('address') address: string,
  ): Promise<void> {
    if (!address || address.length < 40 || !checkAddress(address, true)) {
      return endResponse.bind(this)(400, 'Bad Request', 'Validation Error', {
        query: {
          address:
            'Must be a valid public address [string] starting with 0x of which length is equal to 40 if (0x) prefix is skipped',
        },
      });
    }
    await this.userAddressRepository.updateAll({isVerified: true}, {address});

    const userWithSameAddress = await this.userRepo.findOne({
      where: {address},
    });

    const nonce: number = generateNonce();
    const userId: string | undefined = userWithSameAddress?._id;
    await this.userAddressRepository.create({
      address,
      isVerified: false,
      nonce,
      userId,
      sentAt: new Date(),
    });

    return endResponse.bind(this)(201, 'Created', 'Please sign the message', {
      message: SIGN_MESSAGE_TEMPLATE + nonce.toString(),
    });
  }

  @post('/user/signup/signature', {
    requestBody: GET_NONCE_REQUEST,
    responses: {
      '200': GET_NONCE_RESPONSE,
      '400': GET_NONCE_RESPONSE_BADREQUEST,
    },
  })
  @response(200, GET_NONCE_RESPONSE)
  @response(400, GET_NONCE_RESPONSE_BADREQUEST)
  async signMessage(
    @param.query.string('address') address: string,
    @requestBody(SIGN_MESSAGE_REQUEST) body: SignMessageRequestBody,
  ): Promise<void> {
    if (!address || address.length < 40 || !checkAddress(address, true)) {
      return endResponse.bind(this)(400, 'Bad Request', 'Validation Error', {
        query: {
          address:
            'Must be a valid public address [string] starting with 0x of which length is equal to 40 if (0x) prefix is skipped',
        },
      });
    }
    if (!body || !body.signature || typeof body.signature !== 'string') {
      return endResponse.bind(this)(400, 'Bad Request', 'Validation Error', {
        body: {
          signature: 'Must be a string.',
        },
      });
    }
    const lastObject = await this.userAddressRepository.findOne({
      where: {address, isVerified: false},
    });
    if (!lastObject || !lastObject.nonce) {
      return endResponse.bind(this)(
        404,
        'Not Found',
        'No unsigned nonces found please request a nonce first.',
      );
    }
    const recoveredAddress = recoverAddressfromSignature(
      body.signature,
      SIGN_MESSAGE_TEMPLATE + lastObject.nonce.toString(),
    );
    if (recoveredAddress !== address) {
      return endResponse.bind(this)(
        401,
        'Signature Invalid',
        'Recovered address from signature does not match your given address',
      );
    }
    lastObject.isVerified = true;
    lastObject.verifiedAt = new Date();
    let userWithSameAddress = await this.userRepo.findOne({
      where: {address},
    });
    let userId;
    if (userWithSameAddress) {
      userId = userWithSameAddress._id;
      userWithSameAddress.lastLoginAt = new Date();
      userWithSameAddress.signedAt = new Date();
      await this.userRepo.update(userWithSameAddress);
      lastObject.userId = userId;
    } else {
      const user = new User({
        address,
        createdAt: new Date(),
        emailVerified: false,
        isAdmin: false,
        isVerified: false,
        lastLoginAt: new Date(),
        mobileVerified: false,
        signedAt: new Date(),
        updatedAt: new Date(),
      });
      userWithSameAddress = await this.userRepo.create(user);
      userId = userWithSameAddress._id;
      lastObject.userId = userId;
    }
    const ip =
      this.req.headers['x-forwarded-for']?.toString() ??
      this.req.connection.remoteAddress ??
      this.req.socket.remoteAddress ??
      this.req.connection.remoteAddress;
    const token = createJWT(userWithSameAddress, '7d');
    const loginTokenDoc = new LoginToken({
      date: new Date(),
      ip,
      token,
      userId,
    });
    await this.loginTokenRepository.create(loginTokenDoc);
    await this.userAddressRepository.update(lastObject);
    return endResponse.bind(this)(
      201,
      'Created',
      'User created/updated successfully. Please use this token in your next requests',
      {
        token,
      },
    );
  }
  @get('/user/signup/nonce', {
    requestBody: GET_NONCE_REQUEST,
    responses: {
      '200': GET_NONCE_RESPONSE,
      '400': GET_NONCE_RESPONSE_BADREQUEST,
    },
  })
  @response(200, GET_NONCE_RESPONSE)
  @response(400, GET_NONCE_RESPONSE_BADREQUEST)
  @authenticate('jwt')
  async getMe() {
    console.log('this.user = ', this.user);
  }
}
