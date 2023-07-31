import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { subServices } from '../../services/services';
import { AsyncThunkConfig, IGetSubsParams } from '../../services/servicesTypes';
import { IReducedUser } from '../../services/servicesTypes';
import { setLoading } from 'store/reducers/appSlice';
import { follow, unfollow } from './usersSlice';

interface ISubInitialState {
  users: IReducedUser[];
  unfollowedUserIDs: number[];
}

const initialState: ISubInitialState = {
  users: [],
  unfollowedUserIDs: [],
};

export const subSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSubs.fulfilled, (state, action) => {
      state.users = action.payload;
      state.unfollowedUserIDs = [];
    });

    builder.addCase(unfollow.fulfilled, (state, action) => {
      state.unfollowedUserIDs = [
        ...state.unfollowedUserIDs,
        action.payload.userID,
      ];
    });
    builder.addCase(follow.fulfilled, (state, action) => {
      state.unfollowedUserIDs = state.unfollowedUserIDs.filter(
        id => id !== action.payload.userID,
      );
    });
  },
});

export const subReducer = subSlice.reducer;
//export const {  } = subSlice.actions;

export const getSubs = createAsyncThunk<
  IReducedUser[],
  IGetSubsParams,
  AsyncThunkConfig
>('sub/getSubscribers', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLoading(true));
  try {
    return await subServices.getSubs(params);
  } catch (error) {
    return rejectWithValue('[getSubs]: Error');
  } finally {
    dispatch(setLoading(false));
  }
});
