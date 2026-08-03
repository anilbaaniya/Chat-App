import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.js";
import conversationReducer from "./conversation/conversationSlice.js";
import messageReducer from "./message/messageSlice.js";
import userReducer from "./user/userSlice.js";
import presenceReducer from "./presence/presenceSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    message: messageReducer,
    user: userReducer,
    presence: presenceReducer,
  },
});

export default store;
