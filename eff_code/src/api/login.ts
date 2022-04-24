import {UserInfoDto} from '@types';
import {post} from '@utils';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  loginResult: {
    message: string;
    success: boolean;
    userInfoDto: UserInfoDto;
  };
};

export const login = async (request: LoginRequest) => {
  return await post<LoginRequest, LoginResponse>('/account/login', request);
};
