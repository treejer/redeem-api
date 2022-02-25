export function checkHexString(
  str: string,
  hasPrefix = true,
  length = 0,
): boolean {
  const pattern: string =
    '^' +
    (hasPrefix ? '0x' : '') +
    '[0-9a-fA-F]' +
    (length === 0 ? '+' : '{' + length.toString() + '}' + '$');

  return new RegExp(pattern).test(str);
}

export function checkAddress(
  str: string | undefined,
  hasPrefix: boolean | undefined,
) {
  str = str ?? '';
  if (typeof hasPrefix == 'undefined') {
    hasPrefix = str.startsWith('0x');
  }
  return checkHexString(str, hasPrefix, 40);
}
