import queryString from 'query-string';

type FetchOptions = {
  isForm: boolean;
};
type FetchType = <T extends object, U>(url: string, data: T, options?: FetchOptions) => Promise<U>;

const BASE_API = '/api';

export const post: FetchType = async (url, data, options) => {
  const {isForm = true} = options || {};

  // Default options are marked with *
  const response = await fetch(BASE_API + url, {
    body: isForm ? queryString.stringify(data) : JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
      Authorization: '',
    },
    method: 'POST',
    mode: 'cors',
  });

  return response.json();
};

export const get: FetchType = async (url, data) => {
  // Default options are marked with *
  const response = await fetch(`${BASE_API}${url}?${queryString.stringify(data)}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: '',
    },
    mode: 'cors',
  });

  return response.json();
};
