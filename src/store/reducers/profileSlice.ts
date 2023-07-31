import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  IPost,
  IProfile,
  AsyncThunkConfig,
  IUpdateStatusParams,
} from '../../services/servicesTypes';
import { profileService, subServices } from '../../services/services';
import { ISaveProfileInfo, ISetPostParams } from '../../services/servicesTypes';
import { setLoading, setNotice } from 'store/reducers/appSlice';
import { follow, unfollow } from './usersSlice';
import { deleteLike, setLike } from './likesSlice';

export enum postsActionStatusEnum {
  Loading = 'loading',
  Adding = 'adding',
  Removing = 'removing',
  Idle = 'idle',
}

interface IProfileInitialState {
  profileInfo: IProfile | null;
  subscribersCount: number;
  subscriptionsCount: number;
  postsData: IPost[] | null;
  postsActionStatus: postsActionStatusEnum;
}

const initialState: IProfileInitialState = {
  profileInfo: null,
  subscribersCount: 0,
  subscriptionsCount: 0,
  postsData: null,
  postsActionStatus: postsActionStatusEnum.Idle,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: state => {
      state.postsData = null;
      state.profileInfo = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setProfile.fulfilled, (state, action) => {
        state.profileInfo = action.payload.user;
        if (state.profileInfo)
          state.profileInfo.followed = action.payload.followed;
        state.subscribersCount = action.payload.subscribersCount;
        state.subscriptionsCount = action.payload.subscriptionsCount;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        if (state.profileInfo) state.profileInfo.status = action.payload;
      })
      .addCase(saveProfileInfo.fulfilled, (state, action) => {
        state.profileInfo = action.payload;
      })

      .addCase(follow.fulfilled, (state, action) => {
        if (action.payload.userID === state.profileInfo?.id)
          state.profileInfo.followed = true;
      })
      .addCase(unfollow.fulfilled, (state, action) => {
        if (action.payload.userID === state.profileInfo?.id)
          state.profileInfo.followed = false;
      })

      .addCase(setPosts.pending, (state, action) => {
        state.postsActionStatus = postsActionStatusEnum.Loading;
      })
      .addCase(setPosts.fulfilled, (state, action) => {
        state.postsData = action.payload;
        state.postsActionStatus = postsActionStatusEnum.Idle;
      })
      .addCase(setPosts.rejected, (state, action) => {
        state.postsActionStatus = postsActionStatusEnum.Idle;
      })

      .addCase(addPost.pending, (state, action) => {
        state.postsActionStatus = postsActionStatusEnum.Adding;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postsData?.push(action.payload);
        state.postsActionStatus = postsActionStatusEnum.Idle;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.postsActionStatus = postsActionStatusEnum.Idle;
      })

      .addCase(removePost.pending, (state, action) => {
        state.postsActionStatus = postsActionStatusEnum.Removing;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        if (state.postsData && action.payload)
          state.postsData = state.postsData.filter(
            el => el.id !== action.payload,
          );
        state.postsActionStatus = postsActionStatusEnum.Idle;
      })
      .addCase(removePost.rejected, (state, action) => {
        state.postsActionStatus = postsActionStatusEnum.Idle;
      })

      .addCase(setLike.fulfilled, (state, action) => {
        if (state.postsData) {
          state.postsData = state.postsData.map(post =>
            action.payload.postID === post.id
              ? {
                  ...post,
                  likes: post.likes + 1,
                }
              : post,
          );
        }
      })
      .addCase(deleteLike.fulfilled, (state, action) => {
        if (state.postsData) {
          state.postsData = state.postsData.map(post =>
            action.payload?.postID === post.id
              ? {
                  ...post,
                  likes: post.likes - 1,
                }
              : post,
          );
        }
      });
  },
});

export const profileReducer = profileSlice.reducer;
export const { clearProfile } = profileSlice.actions;

export type SetProfileParamsType = {
  authID: number | null;
  userID: number;
};

export type SetProfileResponseType = {
  user: IProfile;
  followed: boolean;
  subscribersCount: number;
  subscriptionsCount: number;
};

export const setProfile = createAsyncThunk<
  SetProfileResponseType,
  SetProfileParamsType,
  AsyncThunkConfig
>(
  'profile/setProfile',
  async ({ authID, userID }, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const user = await profileService.getUserByID(userID);

      const followed =
        authID && authID !== userID
          ? await profileService.getFollow({ authID, userID })
          : false;

      const subscribers = await subServices.getSubs({
        action: 'Subscribers',
        userID,
      });
      const subscriptions = await subServices.getSubs({
        action: 'Subscriptions',
        userID,
      });

      return {
        user,
        followed,
        subscribersCount: subscribers.length,
        subscriptionsCount: subscriptions.length,
      };
    } catch (error) {
      return rejectWithValue('[setProfile]: Error');
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const updateStatus = createAsyncThunk<
  string | null,
  IUpdateStatusParams,
  AsyncThunkConfig
>('profile/updateStatus', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setLoading(true));
  try {
    if (params.status.length > 250) {
      dispatch(
        setNotice({
          noticeType: 'error',
          noticeMessage: 'Max status length 250',
        }),
      );
      return rejectWithValue('Max status length 250');
    }
    return await profileService.updateStatus(params);
  } catch (error) {
    return rejectWithValue('[updateStatus]: Error');
  } finally {
    dispatch(setLoading(false));
  }
});

export const saveProfileInfo = createAsyncThunk<
  IProfile,
  ISaveProfileInfo,
  AsyncThunkConfig
>(
  'profile/saveProfileInfo',
  async (params, { dispatch, rejectWithValue, getState }) => {
    dispatch(setLoading(true));
    try {
      if (params.authID !== params.data.id) {
        dispatch(
          setNotice({ noticeMessage: 'User error', noticeType: 'error' }),
        );
        return rejectWithValue('User error');
      }
      // if (deepEqual(params.data, getState().profile.profileInfo ?? {})) {
      //   dispatch(
      //     setNotice({
      //       noticeMessage: 'Data is not changed',
      //       noticeType: 'error',
      //     }),
      //   );
      //   return rejectWithValue('Data is not changed');
      // }
      return await profileService.saveProfileInfoAPI(params);
    } catch (error) {
      return rejectWithValue('[saveProfileInfo]: Error');
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const setPosts = createAsyncThunk<IPost[], number, AsyncThunkConfig>(
  'profile/setPosts',
  async (userID, { rejectWithValue }) => {
    try {
      return await profileService.getPosts(userID);
    } catch (error) {
      return rejectWithValue('[setPosts]: Error');
    }
  },
);

export const addPost = createAsyncThunk<
  IPost,
  ISetPostParams,
  AsyncThunkConfig
>('profile/addPost', async (data, { dispatch, rejectWithValue }) => {
  try {
    if (!data.message && !data.img_link) {
      dispatch(
        setNotice({
          noticeMessage: 'At least one field is required',
          noticeType: 'error',
        }),
      );
      return rejectWithValue('Fields is required');
    }

    return await profileService.setPost(data);
  } catch (error) {
    return rejectWithValue('[addPost]: Error');
  }
});

export const removePost = createAsyncThunk<
  number | null,
  number,
  AsyncThunkConfig
>('profile/removePost', async (id, { dispatch, rejectWithValue }) => {
  try {
    return await profileService.removePost(id);
  } catch (error) {
    return rejectWithValue('[removePost]: Error');
  }
});
