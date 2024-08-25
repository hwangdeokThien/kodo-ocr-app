import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

interface Note {
  id: number | undefined;
  title: string;
  content: string;
  createdDate: Date;
  modifiedDate: Date;
}

interface Notes {
  notes: Note[];
}

const initialState: Notes = {
  notes: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setNotes: (state: Notes, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    pushNote: (state: Notes, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state: Notes, action: PayloadAction<number>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    updateNote: (state: Notes, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(
        (note) => note.id === action.payload.id
      );
      state.notes[index] = action.payload;
    },
  },
});

export const { setNotes, pushNote, deleteNote, updateNote } =
  notesSlice.actions;

export default notesSlice.reducer;
