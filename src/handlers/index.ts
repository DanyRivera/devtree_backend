import type { Response, Request } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import slug from "slug";
import { hashPassword, checkPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {

    const { email, password, handle } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
        const error = new Error("User created already!")
        return res.status(409).json({ error: error.message });
    }

    const handleExist = await User.findOne({ handle });

    if (handleExist) {
        const error = new Error("Handle selected already, choose another one.")
        return res.status(409).json({ error: error.message });
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = slug(handle, "_");

    await user.save();

    res.status(201).send("User Created Successfully")
}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    //Revisar si el usuario existe
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
        const error = new Error("User doesn't exist.")
        return res.status(404).json({ error: error.message });
    }

    //Comprobar Password
    // console.log(typeof user.password);
    const isPasswordCorrect = await checkPassword(password, user.password.toString());

    if (!isPasswordCorrect) {
        const error = new Error("The password is incorrect.")
        return res.status(401).json({ error: error.message });
    }

    const token = generateJWT({id: user._id});

    res.send(token)
}