import { Elysia, t } from "elysia";
import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    password: string;
    name: string;
    email: string;
    avatar?: string;
}

export const userModel = new Elysia().model({
    userModel: t.Object({
        username: t.String(),
        password: t.String(),
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
    }),
});

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: false },
});

const User = model("User", userSchema);

export default User;
