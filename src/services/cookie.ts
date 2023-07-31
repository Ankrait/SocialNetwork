export const getCookie = (name: string): string | undefined => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (name: string, value: string, options: any): void => {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', {
    'max-age': -1,
  });
};

export const createToken = (len = 15): string => {
  let symbols =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  let token = [];
  for (let i = 0; i < len; i++) {
    let symbol = +(Math.random() * (symbols.length - 1)).toFixed(0);
    token[i] = symbols[symbol];
  }
  return token.join('');
};
