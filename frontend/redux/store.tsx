import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./noteReducer";

export const store = configureStore({
  reducer: {
    note: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
