import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversations } from "../../services/conversationService.js";
const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchConversations = createAsyncThunk(
  "conversation/getConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversations();
      console.log(response.data);
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
});

export default conversationSlice.reducer;
