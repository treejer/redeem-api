import * as ESU from 'eth-sig-util';
export function hexEncode(str: string): string {
  let hex: string;

  let result = '';
  for (let i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
}
export function recoverAddressfromSignature(
  signature: string,
  message: string,
): string {
  const obj = {
    sig: signature,
    data: hexEncode(message),
  };
  return ESU.recoverPersonalSignature(obj);
}
