import { RootStateType, AppDispatchType } from '../store/createStore';

export interface IAuthData {
  id: number;
  email: string;
  login: string;
  password: string;
  token: string;
  main_color: string;
}

export interface IPost {
  id: number;
  userID: number;
  message: string | null;
  img_link: string | null;
  likes: number;
  reposts: number;
}

export interface IProfile {
  id: number;
  fullName: string;
  name: string;
  age: number;
  status: string | null;
  location: {
    city: string;
    country: string;
  };
  photoURL: string | null;
  followed?: boolean;
}

export interface IReducedUser {
  id: number;
  name: string;
  photoURL: string | null;
}

export interface ITotalCount {
  value: number;
}

export interface IMessage {
  id: number;
  fromID: number;
  withID: number;
  message: string;
}

export interface IFollowed {
  authID: number;
  userID: number;
  id: number;
}

export type AsyncThunkConfig = {
  state: RootStateType;
  dispatch: AppDispatchType;
  extra?: unknown;
  rejectValue: string;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
};

export interface ILoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IGetMesParams {
  authID: number;
  withID: number;
}

export interface ISetMesParams extends IGetMesParams {
  message: string;
}

export interface IUpdateStatusParams {
  authID: number;
  status: string;
}

export interface ISaveProfileInfo {
  authID: number;
  data: IProfile;
}

export interface IIdsParams {
  authID: number;
  userID: number;
}

export interface ISetPostParams {
  message: string | null;
  img_link: string | null;
  userID: number;
}

export interface IGetFollowParams {
  userID: number;
  authID: number;
}

export type SubType = 'Subscriptions' | 'Subscribers';

export interface IGetSubsParams {
  action: SubType;
  userID: number;
}

export interface ILikes {
  id: number;
  postID: number;
  userID: number;
}

export interface ISetLikesParams extends Omit<ILikes, 'id'> {
  likesCount: number;
}

export interface ISetColor {
  authID: number;
  main_color: string;
}

export interface IRegisterParams {
  email: string;
  login: string;
  password: string;
  confirm_password: string;
  fullName: string;
  name: string;
  age: number;
}
