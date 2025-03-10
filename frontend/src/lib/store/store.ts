import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"; // Ensure this is correct

const store = configureStore({
  reducer: {
    auth: authReducer, // Make sure 'auth' key exists
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
