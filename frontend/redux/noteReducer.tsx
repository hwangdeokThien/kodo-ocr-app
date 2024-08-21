import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Note {
  id: number;
  title: string;
  content: string;
  createdDate: string;
  updatedDate: string;
}

interface Notes {
  notes: Note[];
  filteredNotes: Note[];
  searchQuery: string;
  sortOrder: string;
}

const initialState: Notes = {
  notes: [],
  filteredNotes: [],
  searchQuery: "",
  sortOrder: "newest",
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
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

export const {} = notesSlice.actions;

export default notesSlice.reducer;
