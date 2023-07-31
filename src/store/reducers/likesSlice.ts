import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAuth } from './authSlice';
import {
  AsyncThunkConfig,
  ILikes,
  ISetLikesParams,
} from '../../services/servicesTypes';
import { likesServices } from '../../services/services';

interface IAppInitialState {
  likes: ILikes[];
  loading: boolean;
}

const initialState: IAppInitialState = {
  likes: [],
  loading: false,
};

export const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    clearLikes: state => {
      state.likes = [];
    },
    setLikesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getLikes.fulfilled, (state, action) => {
      state.likes = action.payload;
    });
    builder.addCase(setLike.fulfilled, (state, action) => {
      state.likes.push(action.payload);
    });
    builder.addCase(deleteLike.fulfilled, (state, action) => {
      state.likes = state.likes.filter(like => like.id !== action.payload?.id);
    });
  },
});

export const likesReducer = likesSlice.reducer;
export const { setLikesLoading, clearLikes } = likesSlice.actions;

export const getLikes = createAsyncThunk<ILikes[], number, AsyncThunkConfig>(
  'likes/getLikes',
  async (userID, { rejectWithValue }) => {
    try {
      return await likesServices.getUserLikes(userID);
    } catch (error) {
      return rejectWithValue('[getLikes]: Error');
    }
  },
);

export const setLike = createAsyncThunk<
  ILikes,
  ISetLikesParams,
  AsyncThunkConfig
>('likes/setLike', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLikesLoading(true));
  try {
    return await likesServices.setLike(params);
  } catch (error) {
    return rejectWithValue('[setLike]: Error');
  } finally {
    dispatch(setLikesLoading(false));
  }
});

export const deleteLike = createAsyncThunk<
  ILikes | null,
  ISetLikesParams,
  AsyncThunkConfig
>('likes/deleteLike', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLikesLoading(true));
  try {
    return await likesServices.deleteLike(params);
  } catch (error) {
    return rejectWithValue('[deleteLike]: Error');
  } finally {
    dispatch(setLikesLoading(false));
  }
});
