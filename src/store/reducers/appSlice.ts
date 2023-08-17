import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { setAuth } from './authSlice';
import { AsyncThunkConfig } from '../../services/servicesTypes';

export interface INotice {
  noticeMessage: string | null;
  noticeType: 'error' | 'success' | null;
}

interface IAppInitialState {
  isAppInitialized: boolean;
  notice: INotice;
  loading: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: IAppInitialState = {
  isAppInitialized: false,
  notice: {
    noticeMessage: null,
    noticeType: null,
  },
  loading: false,
  isMobileMenuOpen: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setNotice: (state, action: PayloadAction<INotice>) => {
      state.notice = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(initialize.fulfilled, state => {
      state.isAppInitialized = true;
    });
    builder.addCase(initialize.rejected, state => {
      state.isAppInitialized = true;
    });
  },
});

export const appReducer = appSlice.reducer;
export const { setNotice, setLoading, setMobileMenuOpen } = appSlice.actions;

export const initialize = createAsyncThunk<void, void, AsyncThunkConfig>(
  'app/initialize',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      await dispatch(setAuth());
    } catch (error) {
      return rejectWithValue('[initialize]: Error');
    } finally {
      dispatch(setLoading(false));
    }
  },
);
