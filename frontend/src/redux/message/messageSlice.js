import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMessages,
  markSeenMessage as markConversationAsSeenService,
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

export const markConversationAsSeen = createAsyncThunk(
  "message/markConversationAsSeen",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await markConversationAsSeenService(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  },
);

const updateSeenMessages = (state, payload) => {
  const { messageIds, seenAt } = payload;

  const seenIds = new Set(messageIds);

  state.messages.forEach((message) => {
    if (seenIds.has(message._id)) {
      message.isSeen = true;
      message.seenAt = seenAt;
    }
  });
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    messagesSeen(state, action) {
      updateSeenMessages(state, action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
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
      })
      .addCase(markConversationAsSeen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markConversationAsSeen.fulfilled, (state, action) => {
        state.loading = false;
        updateSeenMessages(state, action.payload);
      })
      .addCase(markConversationAsSeen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, messagesSeen, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
