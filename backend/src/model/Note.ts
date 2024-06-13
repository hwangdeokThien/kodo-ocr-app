import { Schema, model } from "mongoose";

interface INote {
    title: string;
    content: string;
}

const userSchema = new Schema<INote>({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const Note = model("Note", userSchema);

export default Note;
