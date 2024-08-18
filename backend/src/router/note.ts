import { Elysia, NotFoundError, t } from "elysia";
import Note from "../model/Note";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import fs from 'fs';

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.SECRET_S3_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        secretAccessKey: secretAccessKey,
        accessKeyId: accessKey
    },
    region: bucketRegion
} as S3ClientConfig)

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

async function scanPhoto(body: any) {
    try {
        const arrayBuffer = await body.photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `public/${Date.now()}.jpg`;
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            Content: body.mimeType
            
        }

        const command = new PutObjectCommand(params);
        const response = await s3.send(command);
        console.log(response);

        const url = `https://${bucketName}.s3.amazonaws.com/${fileName}`
        return url;
    } catch (error) {
        console.log(`Error scanning note: ${error}`);
    }
}

const noteRoutes = new Elysia({ prefix: "/notes" })
    .get("/", () => getNotes())
    .get("/:id", ({ params: { id } }) => getNoteById(id))
    .post("/scan", ({ body }) => scanPhoto(body), { type: 'multipart/form-data' })
    .post("/", ({ body }) => createNote(body))
    .patch("/:id", ({ params: { id }, body }) => updateNote(id, body))
    .delete("/:id", ({ params: { id } }) => deleteNote(id));

export default noteRoutes;
