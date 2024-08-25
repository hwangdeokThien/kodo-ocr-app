import { Schema, model } from "mongoose";

interface INote {
    id: string;
    title: string;
    content: string;
    createdDate: string;
    modifiedDate: string;
}

const userSchema = new Schema<INote>({
    id: {type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdDate: { type: String, default: new Date().toLocaleDateString() },
    modifiedDate: { type: String, default: new Date().toLocaleDateString() },
});

const Note = model("Note", userSchema);

export default Note;
