import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onlineUsers: [],
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = presenceSlice.actions;

export default presenceSlice.reducer;
