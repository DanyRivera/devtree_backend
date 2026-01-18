import { Router } from "express";
import { body } from "express-validator";
import { createAccount, login } from "./handlers";
import { handleInputErros } from "./middleware/validation";

const router = Router();

//Auth and Register
router.post('/auth/register',

    body('handle')
        .notEmpty()
        .withMessage("The handle cannot be empty."),
    body('name')
        .notEmpty()
        .withMessage("The name cannot be empty."),
    body('email')
        .isEmail()
        .withMessage("Invlid e-mail."),
    body('password')
        .isLength({min: 8})
        .withMessage("The password must be at least 8 characters."),

    handleInputErros,

    createAccount
)

router.post('/auth/login',  
    body('email')  
        .isEmail()
        .withMessage('Invlid e-mail.'),
    body('password')
        .notEmpty()
        .withMessage("The password is mandatory."),
        
    handleInputErros,

    login
)


export default router;