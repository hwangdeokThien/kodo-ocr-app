import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./noteReducer";

export const store = configureStore({
  reducer: {
    note: noteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
