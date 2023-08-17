import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  AsyncThunkConfig,
  IFollowed,
  IProfile,
  IIdsParams,
} from '../../services/servicesTypes';
import { usersService } from '../../services/services';

interface IUsersInitialState {
  users: IProfile[];
  totalCount: number;
  currentPage: number;
  isFetching: boolean;
  followingInProgress: number[];
}

const initialState: IUsersInitialState = {
  users: [],
  totalCount: 0,
  currentPage: 1,
  isFetching: true,
  followingInProgress: [],
};

export interface IFollowInProgressParams {
  userID: number;
  isFetching: boolean;
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFollowingInProgress: (
      state,
      action: PayloadAction<IFollowInProgressParams>,
    ) => {
      state.followingInProgress = action.payload.isFetching
        ? [...state.followingInProgress, action.payload.userID]
        : state.followingInProgress.filter(id => id !== action.payload.userID);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(requestUsers.fulfilled, (state, action) => {
        const { dataUsers, dataFollows, count } = { ...action.payload };

        state.users = dataUsers.map(user => {
          if (dataFollows.findIndex(el => el.userID === user.id) !== -1) {
            return { ...user, followed: true };
          }
          return user;
        });

        state.totalCount = count;
      })
      .addCase(follow.fulfilled, (state, action) => {
        state.users = state.users.map(user => {
          if (user.id === action.payload.userID) {
            return { ...user, followed: true };
          }
          return user;
        });
      })
      .addCase(unfollow.fulfilled, (state, action) => {
        state.users = state.users.map(user => {
          if (user.id === action.payload.userID) {
            return { ...user, followed: false };
          }
          return user;
        });
      });
  },
});

export const usersReducer = usersSlice.reducer;
export const { setFollowingInProgress, setCurrentPage } = usersSlice.actions;

export interface IRequestUsersParams {
  currentPage: number;
  pageSize: number;
  authID: number | null;
}
export interface IRequestUsersResponse {
  dataUsers: IProfile[];
  dataFollows: IFollowed[];
  count: number;
}

export const requestUsers = createAsyncThunk<
  IRequestUsersResponse,
  IRequestUsersParams,
  AsyncThunkConfig
>(
  'users/requestUsers',
  async ({ currentPage, pageSize, authID }, { rejectWithValue }) => {
    try {
      const dataUsers = await usersService.getUsers(currentPage, pageSize);
      const dataFollows = await usersService.getFollows(authID ?? 0);
      const count = await usersService.getTotalUsersCount();

      return { dataUsers, dataFollows, count };
    } catch (error) {
      return rejectWithValue('[requestUsers]: Error');
    }
  },
);

export const follow = createAsyncThunk<IFollowed, IIdsParams, AsyncThunkConfig>(
  'users/follow',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(
      setFollowingInProgress({ isFetching: true, userID: params.userID }),
    );
    try {
      return await usersService.postFollow(params);
    } catch (error) {
      return rejectWithValue('[follow]: Error');
    } finally {
      dispatch(
        setFollowingInProgress({ isFetching: false, userID: params.userID }),
      );
    }
  },
);

export const unfollow = createAsyncThunk<
  IFollowed,
  IIdsParams,
  AsyncThunkConfig
>('users/unfollow', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setFollowingInProgress({ isFetching: true, userID: params.userID }));
  try {
    return await usersService.deleteFollow(params);
  } catch (error) {
    return rejectWithValue('[unfollow]: Error');
  } finally {
    dispatch(
      setFollowingInProgress({ isFetching: false, userID: params.userID }),
    );
  }
});
