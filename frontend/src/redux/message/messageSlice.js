import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMessages,
  sendMessage as sendMessageService,
} from "../../services/messageService";
const initialState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  "message/getMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await getMessages(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Failed to fetch messages");
    }
  },
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await sendMessageService(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.data?.message || "Failed to fetch messages");
    }
  },
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages = state.messages.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;

        // Add the newly sent message to the existing list
        state.messages.push(action.payload.data);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
