import colors from "colors";
import mongoose from "mongoose";
import User, {IUser} from "../models/User";

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI);

        const url = `${connection.host}:${connection.port}`;
        console.log(colors.cyan.bold(`MongoDB Conectado en ${url}`));

    } catch (error) {
        console.log(colors.bgRed.white(error.message));
        process.exit(1);
    }
}