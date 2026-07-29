import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchUser } from "../../services/userService";

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
      });
  },
});

export default userSlice.reducer;
