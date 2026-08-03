import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchUser } from "../../services/userService";
import { updateUser } from "../../services/userService";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (search, { rejectWithValue }) => {
    try {
      const response = await searchUser(search);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateMe",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateUser(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.loading = false;
        // backend sometimes returns data: { user: updatedUser } or data: updatedUser
        const payloadData = action.payload && action.payload.data;
        state.user = payloadData?.user ?? payloadData ?? state.user;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
