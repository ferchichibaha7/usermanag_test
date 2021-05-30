import { userController } from '../../controllers/user.controller';
import { Router } from "express";
import { check } from "express-validator/check";


const router: Router = Router();
const ctrl = new userController();
const validateOptions =   [
  check("email", "Please include a valid email").isEmail(),
  check("username", "Please include a valid alphanumeric username").isAlphanumeric(),
  check(
    "password",
    "Please enter a password with 8 or more characters"
  ).isLength({ min: 8 })
];

router.post( "/create",validateOptions,(...params) => ctrl.create(...params));

export default router;
