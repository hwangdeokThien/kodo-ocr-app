import { Elysia } from "elysia";
import noteRoutes from "./router/note";
import userRoutes from "./router/user";
import photoRoutes from "./router/photo";
import connectDB from "./data/connectDB";

connectDB();

const app = new Elysia()
    .group("/api", (app) => app.use(noteRoutes).use(userRoutes).use(photoRoutes))
    .listen(process.env.PORT || 1608);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
