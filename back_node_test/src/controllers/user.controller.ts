import User from '../models/User';
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";


export class userController {

constructor() {}

public async create(...params){
    const[req, res, next] = params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
        }
    
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ where:{ email : email }});
    
        if (user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            errors: [
                {
                  msg: "User already exists"
                }
              ]
            });
          }
        
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
    
         await User.create({email: email, password: hashed})
            res.json({ message: "User Registered" });
      
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
          }

        }
}