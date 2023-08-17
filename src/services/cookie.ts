export const getCookie = (name: string): string | undefined => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (name: string, value: string, delay: number): void => {
  const options: { [key: string]: string } = {
    path: '/',
    'max-age': delay.toString(),
  };

  let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    cookie += '; ' + optionKey + '=' + options[optionKey];
  }

  document.cookie = cookie;
};

export const deleteCookie = (name: string): void => {
  setCookie(name, '', -1);
};

export const createToken = (len = 15): string => {
  const symbols =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  const token = [];

  for (let i = 0; i < len; i++) {
    const symbol = +(Math.random() * (symbols.length - 1)).toFixed(0);
    token.push(symbols[symbol]);
  }

  return token.join('');
};
