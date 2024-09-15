import { Elysia } from "elysia";
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
        const formData = new FormData()
        formData.append('image', body.photo, 'image.jpg')
        formData.append('req_struct', body.req_struct)
        formData.append('llm_aided', body.llm_aided)

        // Send the request to the Flask API
        const ai_api = process.env.AI_BASE_API || 'http://127.0.0.1:5000'
        const reg_det_text = await fetch(ai_api + '/scan', {
            method: 'POST',
            body: formData
        })

        return reg_det_text;
    } catch (error) {
        console.log(`Error scanning note: ${error}`);
    }
}

async function savePhoto(body: any) {
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

const photoRoutes = new Elysia({ prefix: "/photos" })
    .get("/:id", ({params: {id}, body}) => getPhoto(id, body))
    .post("/save", ({ body }) => savePhoto(body), { type: 'multipart/form-data' })
    .post("/scan", ({ body }) => scanPhoto(body), { type: 'multipart/form-data' })
    .delete("/:id", ({ params: { id } }) => deletePhoto(id));

export default photoRoutes;
