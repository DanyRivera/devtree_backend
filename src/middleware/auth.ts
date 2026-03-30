import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

//Para poder modificar el REQ
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message })
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message })
    }


    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);

        //Verificación extra para acceder al result.id
        if (typeof result === 'object' && result.id) {

            const user = await User.findById(result.id).select('-password');

            if (!user) {
                const error = new Error('El Usuario no Existe');
                return res.status(404).json({ error: error.message })
            }

            //Para tenerlo disponible en la siguiente función
            req.user = user;

            next();
        }
    } catch (error) {
        return res.status(500).json({ error: 'Token no Válido' })
    }
}