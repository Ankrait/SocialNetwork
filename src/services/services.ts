import axios from 'axios';
import { sha256 } from 'crypto-hash';

import {
  ISetLikesParams,
  ILikes,
  ISetColor,
  IRegisterParams,
  ITotalCount,
  ISaveProfileInfo,
  IIdsParams,
  ISetPostParams,
  IReducedUser,
  IGetSubsParams,
  ILoginParams,
  IGetMesParams,
  ISetMesParams,
  IUpdateStatusParams,
  IAuthData,
  IFollowed,
  IMessage,
  IPost,
  IProfile,
} from './servicesTypes';

import * as cookie from './cookie';
import { MAIN_COLOR } from '../common/constants';

// const baseURL = 'http://localhost:3011/';
const baseURL = 'https://socnetserver-az1kgo.b4a.run/';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = false;

export const authService = {
  getAuth: async () => {
    const id = cookie.getCookie('id');
    const token = cookie.getCookie('token');
    const response = await axios.get<IAuthData[]>(`auth?id=${id}&_limit=1`);

    return response.data[0].token === token && response.data[0];
  },
  login: async ({ email, password, rememberMe = false }: ILoginParams) => {
    const response = await axios.get<IAuthData[]>(
      `auth?email=${email}&password=${await sha256(password)}`,
    );

    if (!response.data[0]) {
      return false;
    }

    const token = cookie.createToken();
    const auth = await axios.patch<IAuthData>(`auth/${response.data[0].id}`, {
      token,
    });
    const delay = rememberMe ? 3600 * 24 * 30 : 3600 * 24;

    cookie.setCookie('token', token, delay);
    cookie.setCookie('id', `${response.data[0].id}`, delay);

    return auth.data;
  },
  logout: async () => {
    const response = await axios.get<IAuthData[]>(
      `auth?id=${cookie.getCookie('id')}`,
    );
    const auth = await axios.patch<IAuthData>(`auth/${response.data[0].id}`, {
      token: '',
    });

    cookie.deleteCookie('token');

    return auth.data;
  },
  register: async (params: IRegisterParams) => {
    const { age, fullName, name, email, login, password } = params;

    const check_email = await axios.get<IAuthData[]>(`auth?email=${email}`);
    if (check_email.data.length > 0) {
      return 'This email is already registered';
    }

    const check_login = await axios.get<IAuthData[]>(`auth?login=${login}`);
    if (check_login.data.length > 0) {
      return 'This login is already registered';
    }

    const profile = await axios.post<IProfile>(`users`, {
      fullName,
      name,
      age,
      status: '',
      location: {
        country: '',
        city: '',
      },
      photoURL: '',
    });

    await axios.post<IAuthData>(`auth`, {
      id: profile.data.id,
      email,
      login,
      password: await sha256(password),
      token: '',
      main_color: MAIN_COLOR,
    });

    const totalCount = await axios.get<ITotalCount>(`totalCount`);
    await axios.patch<ITotalCount>(`totalCount`, {
      value: totalCount.data.value + 1,
    });

    return true;
  },
  setColor: async ({ authID, main_color }: ISetColor) => {
    const response = await axios.patch<IAuthData>(`auth/${authID}`, {
      main_color,
    });

    return response.data.main_color;
  },
};

export const usersService = {
  getUsers: async (currentPage = 1, pageSize = 4) => {
    const response = await axios.get<IProfile[]>(
      `users?_page=${currentPage}&_limit=${pageSize}`,
    );
    return response.data;
  },
  getTotalUsersCount: async () => {
    const response = await axios.get<ITotalCount>(`totalCount`);
    return response.data.value;
  },
  getFollows: async (authID = 0, userID = 0) => {
    const response = await axios.get<IFollowed[]>(
      `followed?authID=${authID}${userID !== 0 ? '&userID=' + userID : ''}`,
    );
    return response.data;
  },
  deleteFollow: async ({ authID, userID }: IIdsParams) => {
    const data = await axios.get<IFollowed[]>(
      `followed?authID=${authID}&userID=${userID}`,
    );

    await axios.delete<IFollowed>(`followed/${data.data[0].id}`);

    return data.data[0];
  },
  postFollow: async ({ authID, userID }: IIdsParams) => {
    const response = await axios.post<IFollowed>(`followed`, {
      authID,
      userID,
    });
    return response.data;
  },
};

export const messagesService = {
  getMessages: async ({ authID, withID }: IGetMesParams) => {
    const fromMessages = await axios.get<IMessage[]>(
      `messages?fromID=${authID}&withID=${withID}`,
    );
    const toMessages = await axios.get<IMessage[]>(
      `messages?fromID=${withID}&withID=${authID}`,
    );

    let allMessages: IMessage[] = Array.prototype
      .concat(fromMessages.data, toMessages.data)
      .sort((a, b) => {
        return a.id - b.id;
      });

    return allMessages;
  },
  setMessage: async ({ authID, withID, message }: ISetMesParams) => {
    const response = await axios.post<IMessage>(`messages`, {
      fromID: authID,
      withID,
      message,
    });

    return response.data;
  },
  deleteMessage: async (id: number) => {
    await axios.delete(`messages/${id}`);

    return id;
  },
  getDialogs: async (authID: number) => {
    const fromMessages = await axios.get<IMessage[]>(
      `messages?fromID=${authID}`,
    );
    const toMessages = await axios.get<IMessage[]>(`messages?withID=${authID}`);

    let dialogs: number[] = Array.prototype
      .concat(
        fromMessages.data.map(el => el.withID),
        toMessages.data.map(el => el.fromID),
      )
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => b.id - a.id);

    if (dialogs.length === 0) return [];

    const { data } = await axios.get<IReducedUser[]>(
      `users?id=${dialogs.join('&id=')}`,
    );

    return data;
  },
};

export const profileService = {
  getUserByID: async (userID = 0) => {
    const id = userID !== 0 ? userID : 1;
    const response = await axios.get<IProfile[]>(`users?id=${id}&_limit=1`);
    return response.data[0];
  },
  updateStatus: async ({ authID, status }: IUpdateStatusParams) => {
    const response = await axios.patch<IProfile>(`users/${authID}`, {
      status,
    });
    return response.data.status;
  },
  updateProfileInfo: async ({ authID, data }: ISaveProfileInfo) => {
    const response = await axios.patch<IProfile>(`users/${authID}`, {
      ...data,
    });
    return response.data;
  },
  getPosts: async (userID: number) => {
    const response = await axios.get<IPost[]>(`posts?userID=${userID}`);

    return response.data;
  },
  setPost: async ({ message, img_link, userID }: ISetPostParams) => {
    const response = await axios.post<IPost>(`posts`, {
      userID,
      message,
      img_link,
      likes: 0,
      reposts: 0,
    });

    return response.data;
  },
  removePost: async (id: number) => {
    await axios.delete(`posts/${id}`);

    return id;
  },
  getFollow: async ({ userID, authID }: IIdsParams) => {
    const response = await axios.get<IFollowed[]>(
      `followed?authID=${authID}&userID=${userID}`,
    );

    return response.data.length > 0;
  },
};

export const subServices = {
  getSubs: async ({ action, userID }: IGetSubsParams) => {
    const { data: follows } = await axios.get<IFollowed[]>(
      baseURL +
        `followed?${
          action === 'Subscriptions' ? 'authID' : 'userID'
        }=${userID}`,
    );

    if (follows.length === 0) return [];

    const users = follows.map(follow =>
      action === 'Subscriptions' ? follow.userID : follow.authID,
    );

    const response = await axios.get<IReducedUser[]>(
      `users?id=${users.join('&id=')}`,
    );

    return response.data;
  },
};

export const likesServices = {
  getUserLikes: async (userID: number) => {
    return (await axios.get<ILikes[]>(`likes?userID=${userID}`)).data;
  },
  setLike: async ({ postID, userID, likesCount }: ISetLikesParams) => {
    const response = await axios.post<ILikes>(`likes`, {
      postID,
      userID,
    });

    await axios.patch(`posts/${postID}`, {
      likes: likesCount + 1,
    });

    return response.data;
  },
  deleteLike: async ({ postID, userID, likesCount }: ISetLikesParams) => {
    const { data } = await axios.get<ILikes[]>(
      `likes?postID=${postID}&userID=${userID}`,
    );
    await axios.delete(`likes/${data[0].id}`);

    await axios.patch(`posts/${postID}`, {
      likes: likesCount - 1,
    });

    return data[0];
  },
};
