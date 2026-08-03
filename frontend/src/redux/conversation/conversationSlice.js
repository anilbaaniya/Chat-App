import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversations } from "../../services/conversationService.js";
import { createConversation as createConversationService } from "../../services/conversationService.js";

const initialState = {
  conversations: [],
  selectedConversation: null,
  typingConversations: {},
  loading: false,
  error: null,
};

export const createConversation = createAsyncThunk(
  "conversation/createConversation",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await createConversationService(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong",
      );
    }
  },
);

export const fetchConversations = createAsyncThunk(
  "conversation/getConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversations();
      // console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.data?.message || "Failed to fetch the Conversations!",
      );
    }
  },
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation(state, action) {
      state.selectedConversation = action.payload;
    },
    typingStarted(state, action) {
      state.typingConversations[action.payload.conversationId] = true;
    },

    typingStopped(state, action) {
      state.typingConversations[action.payload.conversationId] = false;
    },

    updateConversation(state, action) {
      const { conversationId, unreadCount, lastMessage } = action.payload;

      const conversation = state.conversations.find(
        (c) => c._id === conversationId,
      );

      if (!conversation) return;

      if (lastMessage) {
        conversation.lastMessage = lastMessage;
        conversation.lastMessageAt = lastMessage.createdAt;
      }

      if (unreadCount !== undefined) {
        conversation.unreadCount = unreadCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data;
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedConversation = action.payload.data;

        // Optional: Add the conversation to the list if it's not already there
        const exists = state.conversations.some(
          (conversation) => conversation._id === action.payload.data._id,
        );

        if (!exists) {
          state.conversations.unshift(action.payload.data);
        }
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedConversation,
  typingStarted,
  typingStopped,
  updateConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
