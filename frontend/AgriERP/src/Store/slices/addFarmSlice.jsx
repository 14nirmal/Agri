// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const addFarm = createAsyncThunk(
//   "addFarmAction",
//   async (data, { rejectWithValue }) => {
//     const res = await fetch("/api/farmer/addfarm", {
//       method: "POST",
//       headers: {
//         "Content-Type": "Application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) {
//       return rejectWithValue({ status: res.status, data: await res.json() });
//     }
//     return { status: res.status, data: await res.json() };
//   }
// );

// const addFarmSlice = createSlice({
//   name: "addFarmSlice",
//   initialState: {
//     res: null,
//     error: false,
//     isLoading: false,
//   },
//   reducers: {
//     clearFarmRes: (state) => {
//       state.res = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(addFarm.fulfilled, (state, action) => {
//       state.res = action.payload;
//       state.error = false;
//       state.isLoading = false;
//     });
//     builder.addCase(addFarm.pending, (state, action) => {
//       state.isLoading = true;
//     });
//     builder.addCase(addFarm.rejected, (state, action) => {
//       state.isLoading = false;
//       state.error = true;
//       state.res = action.payload;
//     });
//   },
// });

// export const { clearFarmRes } = addFarmSlice.actions;
// export default addFarmSlice.reducer;
