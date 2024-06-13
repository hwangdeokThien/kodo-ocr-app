import { Elysia, NotFoundError, t } from "elysia";
import User from "../model/User";
import { userModel } from "../model/User";

async function getUsers() {
    try {
        const users = User.find().select("-password");

        if (!users) {
            throw new NotFoundError("User not found!");
        }

        return users;
    } catch (error) {
        console.log(`Error finding users: ${error}`);
    }
}

async function getUserById(id: string) {
    try {
        const user = User.findById(id).select("-password");

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        return user;
    } catch (error) {
        console.log(`Error finding user: ${error}`);
    }
}

async function createUser(body: any) {
    try {
        const user = await User.findOne({ email: body.email }).select(
            "-password"
        );
        if (user) {
            throw new NotFoundError("User with email already exist!");
        }

        // const hashedPassword = await Bun.password.hash(body.password, {
        //     algorithm: "argon2d",
        // });
        // body.password = hashedPassword;

        let newUser = await new User(body).save();
        return newUser;
    } catch (error) {
        console.log(`Error creating user: ${error}`);
    }
}

async function updateUser(id: string, body: any) {
    try {
        const user = await User.findById(id);

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        console.log(`Sucessfully updating user ${id}`);
        const updatedUser = await User.findByIdAndUpdate(id, body);

        return updatedUser;
    } catch (error) {
        console.log(`Error updating user: ${error}`);
    }
}

async function deleteUser(id: string) {
    try {
        const user = await User.findById(id);

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        console.log(`Sucessfully deleting user ${id}`);
        const deletedUser = await User.findByIdAndDelete(id);

        return deletedUser;
    } catch (error) {
        console.log(`Error deleting user: ${error}`);
    }
}

const userRoutes = new Elysia({ prefix: "/users" })
    .use(userModel)
    .get("/", () => getUsers())
    .get("/:id", ({ params: { id } }) => getUserById(id))
    .post("/register", ({ body }) => createUser(body), {
        body: "userModel",
    })
    .post("/login", () => "login")
    .patch("/:id", ({ params: { id }, body }) => updateUser(id, body))
    .delete("/:id", () => "delete user by id");

export default userRoutes;
