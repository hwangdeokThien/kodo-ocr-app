import { Elysia } from "elysia";
import Note from "../model/Note";
import { PutObjectCommand, S3Client, S3ClientConfig, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

async function scanPhoto(body: any) {
    try {
        const arrayBuffer = await body.photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `public/${Date.now()}.jpg`;
        const putObjectParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: buffer,
            Content: body.mimeType
            
        }

        const command = new PutObjectCommand(putObjectParams);
        const response = await s3.send(command);
        console.log(response);

        const url = `https://${bucketName}.s3.amazonaws.com/${fileName}`
        return url;
    } catch (error) {
        console.log(`Error scanning note: ${error}`);
    }
}

async function getPhoto(id: string, body: any) {
    const getObjectParams = {
        Bucket: bucketName,
        Key: body.fileName
    }

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // handle update on database

    return url;
}

async function deletePhoto(id: string) {
    const deleteObjectParams = {
        Bucket: bucketName, 
        Key: id
    }

    const command = new DeleteObjectCommand(deleteObjectParams);
    const response = await s3.send(command)

    // handle delete on database
}

const noteRoutes = new Elysia({ prefix: "/photos" })
    .get("/:id", ({params: {id}, body}) => getPhoto(id, body))
    .post("/scan", ({ body }) => scanPhoto(body), { type: 'multipart/form-data' })
    .delete("/:id", ({ params: { id } }) => deletePhoto(id));

export default noteRoutes;
