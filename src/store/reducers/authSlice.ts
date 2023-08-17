import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { authService } from '../../services/services';
import {
  AsyncThunkConfig,
  ILoginParams,
  IAuthData,
  ISetColor,
  IRegisterParams,
} from '../../services/servicesTypes';
import { setLoading, setNotice } from './appSlice';
import { clearLikes } from './likesSlice';
import { clearMessages } from './messagesSlice';
import { clearSubs } from './subSlice';

interface IAuthInitialState {
  userID: number | null;
  email: string | null;
  login: string | null;
  isAuth: boolean;
  main_color: string;
}

const initialState: IAuthInitialState = {
  userID: null,
  email: null,
  login: null,
  isAuth: false,
  main_color: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setColor.fulfilled, (state, action) => {
        state.main_color = action.payload;
      })

      .addMatcher(
        isAnyOf(setAuth.fulfilled, login.fulfilled),
        (state, action) => {
          state.email = action.payload.email;
          state.login = action.payload.login;
          state.userID = action.payload.id;
          state.main_color = action.payload.main_color;
          state.isAuth = true;
        },
      )
      .addMatcher(
        isAnyOf(setAuth.rejected, login.rejected, logout.fulfilled),
        state => {
          state.email = state.login = state.userID = null;
          state.isAuth = false;
          state.main_color = '';
        },
      );
  },
});

export const authReducer = authSlice.reducer;
//export const { * } = authSlice.actions;

export const setAuth = createAsyncThunk<IAuthData, void, AsyncThunkConfig>(
  'auth/setAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getAuth();
      if (!response) {
        return rejectWithValue('Not authorized');
      }
      return response;
    } catch (error) {
      return rejectWithValue('[setAuth]: Error');
    }
  },
);

export const login = createAsyncThunk<
  IAuthData,
  ILoginParams,
  AsyncThunkConfig
>('auth/login', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLoading(true));
  try {
    const response = await authService.login(params);
    if (!response) {
      dispatch(
        setNotice({
          noticeMessage: 'Email or password invalid',
          noticeType: 'error',
        }),
      );

      return rejectWithValue('Incorrect data');
    }

    return response;
  } catch (error) {
    return rejectWithValue('[login]: Error');
  } finally {
    dispatch(setLoading(false));
  }
});

export const register = createAsyncThunk<
  void,
  IRegisterParams,
  AsyncThunkConfig
>('auth/register', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLoading(true));
  try {
    const response = await authService.register(params);

    if (response !== true) {
      dispatch(setNotice({ noticeType: 'error', noticeMessage: response }));
      return rejectWithValue(response);
    }
  } catch (error) {
    return rejectWithValue('[register]: Error');
  } finally {
    dispatch(setLoading(false));
  }
});

export const logout = createAsyncThunk<IAuthData, void, AsyncThunkConfig>(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.logout();
      dispatch(clearLikes());
      dispatch(clearMessages());
      dispatch(clearSubs());
      return response;
    } catch (error) {
      return rejectWithValue('[logout]: Error');
    }
  },
);

export const setColor = createAsyncThunk<string, ISetColor, AsyncThunkConfig>(
  'auth/setColor',
  async (params, { rejectWithValue }) => {
    try {
      return await authService.setColor(params);
    } catch (error) {
      return rejectWithValue('[setColor]: Error');
    }
  },
);
