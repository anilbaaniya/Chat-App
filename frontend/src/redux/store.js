import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import conversationReducer from "./conversation/conversationSlice.js";
import messageReducer from "./message/messageSlice.js";
import userReducer from "./user/userSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
    user: userReducer,
  },
});

export default store;
