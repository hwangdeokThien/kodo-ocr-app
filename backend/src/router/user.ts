import { Elysia, NotFoundError, t } from "elysia";
import User from "../model/User";
import { userModel } from "../model/User";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

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

async function getUsers() {
    try {
        const users = await User.find().select("-password");

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
        const user = await User.findById(id).select("-password");

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
        const user = await User.findById(id).select("-password");

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        console.log(`Sucessfully updating user ${id}`);
        const updatedUser = await User.findByIdAndUpdate(id, body, {new: true}).select("-password");

        return updatedUser;
    } catch (error) {
        console.log(`Error updating user: ${error}`);
    }
}

async function deleteUser(id: string) {
    try {
        const user = await User.findById(id).select("-password");

        if (!user) {
            throw new NotFoundError("User not found!");
        }

        console.log(`Sucessfully deleting user ${id}`);
        await User.findByIdAndDelete(id);
    } catch (error) {
        console.log(`Error deleting user: ${error}`);
    }
}


async function updateUserImage(id: string, body: any) {
    try {
        console.log('UpdateUserImage function called');
        const user = await User.findById(id).select("-password");
        if (!user) {
            throw new NotFoundError("User not found!");
        }

        const arrayBuffer = await body.avatar.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `public/users/${id}.jpg`;
        const putObjectParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            Content: body.mimeType
        }

        const command = new PutObjectCommand(putObjectParams);
        const response = await s3.send(command);
        console.log(response);

        const url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { avatar: url },
            { new: true }
        ).select("-password");

        return updatedUser;
    } catch (error) {
        console.log(`Error updating user image: ${error}`);
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
    .patch("/avatar/:id", ({params: {id}, body}) => updateUserImage(id, body), { type: 'multipart/form-data' })
    .delete("/:id", ({params: {id}}) => deleteUser(id));

export default userRoutes;
