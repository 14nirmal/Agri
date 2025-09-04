import { configureStore } from "@reduxjs/toolkit";
import farmReducer from "./slices/farmmanagemnetSlice";

export const store = configureStore({
  reducer: {
    FarmData: farmReducer,
  },
});
