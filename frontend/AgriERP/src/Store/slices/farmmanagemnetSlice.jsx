import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchfarmdata = createAsyncThunk(
  "fetchfarmdata",
  async (_, { rejectWithValue }) => {
    const res = await fetch("/api/farmer/farms", {
      credentials: "include",
    });
    if (!res.ok) {
      return rejectWithValue({ status: res.status, msg: await res.json() });
    }
    const data = await res.json();
    return data;
  }
);

export const fetchFarmSlice = createSlice({
  initialState: {
    data: null,
    err: false,
    isLoading: false,
  },
  name: "fetchFarmData",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchfarmdata.fulfilled, (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchfarmdata.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchfarmdata.rejected, (state, action) => {
      state.err = true;
      state.data = action.payload;
      state.isLoading = false;
    });
  },
});

export default fetchFarmSlice.reducer;
