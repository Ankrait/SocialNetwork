import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/services';
import {
  AsyncThunkConfig,
  ILoginParams,
  IAuthData,
} from '../../services/servicesTypes';
import { setLoading, setNotice } from './appSlice';
import { clearLikes } from './likesSlice';
import { ISetColor, IRegisterParams } from '../../services/servicesTypes';

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
      .addCase(setAuth.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.login = action.payload.login;
        state.userID = action.payload.id;
        state.isAuth = true;
        state.main_color = action.payload.main_color;
      })
      .addCase(setAuth.rejected, state => {
        state.email = state.login = state.userID = null;
        state.isAuth = false;
        state.main_color = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.login = action.payload.login;
        state.userID = action.payload.id;
        state.isAuth = true;
        state.main_color = action.payload.main_color;
      })
      .addCase(login.rejected, (state, action) => {
        state.email = state.login = state.userID = null;
        state.isAuth = false;
        state.main_color = '';
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.email = state.login = state.userID = null;
        state.isAuth = false;
        state.main_color = '';
      })

      .addCase(setColor.fulfilled, (state, action) => {
        state.main_color = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer;
//export const { toggleInfoForm, setResponseError, setLoading, setResponseNotice } = authSlice.actions;

export const setAuth = createAsyncThunk<IAuthData, void, AsyncThunkConfig>(
  'auth/setAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getAuth();
      if (response.id === -1) {
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
    if (response.id === -1) {
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

      return response;
    } catch (error) {
      return rejectWithValue('[logout]: Error');
    }
  },
);

export const setColor = createAsyncThunk<string, ISetColor, AsyncThunkConfig>(
  'auth/setColor',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.setColor(params);

      return response.main_color;
    } catch (error) {
      return rejectWithValue('[setColor]: Error');
    }
  },
);
