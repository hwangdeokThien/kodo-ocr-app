import { Elysia, t } from "elysia";
import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    password: string;
    name: string;
    email: string;
    bio: string;
    avatar?: string;
    dateOfBirth?: Date;
    location?: string;
    createdAt?: Date;
}

export const userModel = new Elysia().model({
    userModel: t.Object({
        username: t.String(),
        password: t.String(),
        name: t.String(),
        email: t.String(),
        bio: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        dateOfBirth: t.Optional(t.Date()),
        location: t.Optional(t.String()),
        createdAt: t.Optional(t.Date()),
    }),
});

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: false },
    avatar: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    location: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const User = model("User", userSchema);

export default User;
