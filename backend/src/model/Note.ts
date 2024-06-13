import { Schema, model } from "mongoose";

interface INote {
    title: string;
    content: string;
    accessedDate: Date;
}

const userSchema = new Schema<INote>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    accessedDate: { type: Date, default: Date.now },
});

const Note = model("Note", userSchema);

export default Note;
