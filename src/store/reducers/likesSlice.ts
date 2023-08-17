import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

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
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getLikes.fulfilled, (state, action) => {
        state.likes = action.payload;
      })
      .addCase(setLike.fulfilled, (state, action) => {
        state.likes.push(action.payload);
      })
      .addCase(deleteLike.fulfilled, (state, action) => {
        state.likes = state.likes.filter(
          like => like.id !== action.payload?.id,
        );
      })
      .addMatcher(isPending(getLikes, setLike, deleteLike), state => {
        state.loading = true;
      })
      .addMatcher(isRejected(getLikes, setLike, deleteLike), state => {
        state.loading = false;
      })
      .addMatcher(isFulfilled(getLikes, setLike, deleteLike), state => {
        state.loading = false;
      });
  },
});

export const likesReducer = likesSlice.reducer;
export const { clearLikes } = likesSlice.actions;

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
  try {
    return await likesServices.setLike(params);
  } catch (error) {
    return rejectWithValue('[setLike]: Error');
  }
});

export const deleteLike = createAsyncThunk<
  ILikes | null,
  ISetLikesParams,
  AsyncThunkConfig
>('likes/deleteLike', async (params, { dispatch, rejectWithValue }) => {
  try {
    return await likesServices.deleteLike(params);
  } catch (error) {
    return rejectWithValue('[deleteLike]: Error');
  }
});
