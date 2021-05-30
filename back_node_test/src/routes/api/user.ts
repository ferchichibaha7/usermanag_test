import { userController } from '../../controllers/user.controller';
import { Router } from "express";
import { check } from "express-validator/check";
import auth from '../../middleware/auth';
import admin from '../../middleware/admin';


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

router.post( "/create",auth,admin,validateOptions,(...params) => ctrl.create(...params));
router.get( "/list",auth,(...params) => ctrl.findAllUsers(...params));
router.delete( "/delete/:id",auth,admin,(...params) => ctrl.deleteUser(...params));
router.get( "/:id",auth,admin,(...params) => ctrl.findOneUser(...params));
router.put( "/:id",auth,admin,validateOptions,(...params) => ctrl.updateUser(...params));


export default router;
