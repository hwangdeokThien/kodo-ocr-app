import { Elysia, NotFoundError, t } from "elysia";
import Note from "../model/Note";

async function getNotes() {
    try {
        const notes = await Note.find();

        if (!notes) {
            throw new NotFoundError("Notes not found!");
        }

        return notes;
    } catch (error) {
        console.log(`Error finding notes: ${error}`);
    }
}

async function getNoteById(id: String) {
    try {
        const note = await Note.findById(id);

        if (!note) {
            throw new NotFoundError("Note not found!");
        }

        return note;
    } catch (error) {
        console.log(`Error finding note: ${error}`);
    }
}

async function createNote(body: any) {
    try {
        let newNote = await new Note(body).save();
        return newNote;
    } catch (error) {
        console.log(`Error creating note: ${error}`);
    }
}

async function updateNote(id: String, body: any) {
    try {
        const note = await Note.findById(id);

        if (!note) {
            throw new NotFoundError("Note not found!");
        }

        console.log(`Sucessfully updating note ${id}`);
        const updatedNote = await Note.findByIdAndUpdate(id, body);

        return updatedNote;
    } catch (error) {
        console.log(`Error updating note: ${error}`);
    }
}

async function deleteNote(id: String) {
    try {
        const note = await Note.findById(id);

        if (!note) {
            throw new NotFoundError("Note not found!");
        }

        console.log(`Sucessfully deleting note ${id}`);
        await Note.findByIdAndDelete(id);
    } catch (error) {
        console.log(`Error deleting note: ${error}`);
    }
}

const noteRoutes = new Elysia({ prefix: "/notes" })
    .get("/", () => getNotes())
    .get("/:id", ({ params: { id } }) => getNoteById(id))
    .post("/", ({ body }) => createNote(body))
    .patch("/:id", ({ params: { id }, body }) => updateNote(id, body))
    .delete("/:id", ({ params: { id } }) => deleteNote(id));

export default noteRoutes;
