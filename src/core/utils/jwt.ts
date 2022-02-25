import JWT, {JwtPayload} from 'jsonwebtoken';
import {User} from '../../models';

const SECRET: string = process.env.JWT_TOKEN ?? 'NEW_SECRET';

export function createJWT(body: User, expiresIn: string | number): string {
  return JWT.sign(body, SECRET, {expiresIn});
}

export type Payload = User & JwtPayload;
export function decryptJWT(token: string): Payload {
  return JWT.verify(token, SECRET) as Payload;
}
