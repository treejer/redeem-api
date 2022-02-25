import crypto from 'crypto';
import JWT, {JwtPayload} from 'jsonwebtoken';
import {User} from '../../models';

const SECRET: string =
  process.env.JWT_TOKEN ?? crypto.randomBytes(32).toString('hex');

export function createJWT(body: User, expiresIn: string | number): string {
  return JWT.sign(body, SECRET, {expiresIn});
}

export type Payload = User & JwtPayload;
export function decryptJWT(token: string): Payload | void {
  try {
    return JWT.verify(token, SECRET) as Payload;
  } catch (err) {
    return;
  }
}
