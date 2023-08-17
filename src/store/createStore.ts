import { configureStore } from '@reduxjs/toolkit';

import { appReducer } from './reducers/appSlice';
import { authReducer } from './reducers/authSlice';
import { messagesReducer } from './reducers/messagesSlice';
import { profileReducer } from './reducers/profileSlice';
import { usersReducer } from './reducers/usersSlice';
import { subReducer } from './reducers/subSlice';
import { likesReducer } from './reducers/likesSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    messages: messagesReducer,
    profile: profileReducer,
    users: usersReducer,
    sub: subReducer,
    likes: likesReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
