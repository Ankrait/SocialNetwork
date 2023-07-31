import { messagesService } from '../../services/services';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IGetMesParams,
  ISetMesParams,
  IReducedUser,
  IMessage,
  AsyncThunkConfig,
} from '../../services/servicesTypes';
import { setLoading } from './appSlice';

interface IMessagesInitialState {
  dialogsData: IReducedUser[];
  messagesData: IMessage[];
  withID: number | null;
  isNewMessageSending: boolean;
}

const initialState: IMessagesInitialState = {
  dialogsData: [],
  messagesData: [],
  withID: null,
  isNewMessageSending: false,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setWithID: (state, action: PayloadAction<number | null>) => {
      state.withID = action.payload;
    },
    clearMessages: state => {
      state.messagesData = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(setMes.fulfilled, (state, action) => {
        state.messagesData = action.payload;
      })

      .addCase(addMes.pending, state => {
        state.isNewMessageSending = true;
      })
      .addCase(addMes.fulfilled, (state, action) => {
        state.messagesData.push(action.payload);
        state.isNewMessageSending = false;
      })
      .addCase(addMes.rejected, state => {
        state.isNewMessageSending = false;
      })

      .addCase(deleteMes.fulfilled, (state, action) => {
        if (state.messagesData && action.payload) {
          state.messagesData = state.messagesData.filter(
            message => message.id !== action.payload,
          );
        }
      })
      .addCase(getDialogs.fulfilled, (state, action) => {
        state.dialogsData = action.payload;
      });
  },
});

export const messagesReducer = messagesSlice.reducer;
export const { setWithID, clearMessages } = messagesSlice.actions;

export const addMes = createAsyncThunk<
  IMessage,
  ISetMesParams,
  AsyncThunkConfig
>('messages/addMes', async (params, { rejectWithValue }) => {
  try {
    return await messagesService.setMessage(params);
  } catch (error) {
    return rejectWithValue('[addMes]: Error');
  }
});

export const setMes = createAsyncThunk<
  IMessage[],
  IGetMesParams,
  AsyncThunkConfig
>('messages/setMes', async (params, { dispatch, rejectWithValue }) => {
  dispatch(clearMessages());
  dispatch(setLoading(true));
  try {
    return await messagesService.getMessages(params);
  } catch (error) {
    return rejectWithValue('[setMes]: Error');
  } finally {
    dispatch(setLoading(false));
  }
});

export const deleteMes = createAsyncThunk<
  number | null,
  number,
  AsyncThunkConfig
>('messages/deleteMes', async (id, { rejectWithValue }) => {
  try {
    return await messagesService.deleteMessage(id);
  } catch (error) {
    return rejectWithValue('[deleteMes]: Error');
  }
});

export const getDialogs = createAsyncThunk<
  IReducedUser[],
  number,
  AsyncThunkConfig
>('messages/getDialogs', async (authID, { dispatch, rejectWithValue }) => {
  try {
    return await messagesService.getDialogs(authID);
  } catch (error) {
    return rejectWithValue('[getDialogs]: Error');
  }
});
