import * as mongoose from "mongoose";

const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const data_url = `mongodb+srv://${username}:${password}@kodo-ocr-app.oldepoz.mongodb.net/`;

const connectDB = async () => {
    try {
        await mongoose.connect(data_url);
        console.log(`Connected to database successfully`);
    } catch (error) {
        console.log(error);
        console.log(`Cannot connect to database!`);
    }
};

export default connectDB;
