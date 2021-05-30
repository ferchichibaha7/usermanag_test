import bcrypt from "bcryptjs";
import { Router } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import * as _ from 'underscore';
import Payload from "../../types/Payload";
import User from "../../models/User";
import auth from "../../middleware/auth";

const router: Router = Router();



router.get("/", auth, async (req, res) => {
  try {
    let user   = await User.findOne({ where:{ id : req['userId'] },attributes: {exclude: ['password']}});
    res.json({ message: "User retrieved", result: user })
  } catch (err) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }

});


router.post(
  "/",
  [
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { emailOrUsername, password } = req.body;
    try {
      let user = {};
      if(validateEmail(emailOrUsername))
          user = await User.findOne({ where:{ email : emailOrUsername }});
      else
          user = await User.findOne({ where:{ username : emailOrUsername }});
      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Invalid Credentials"
            }
          ]
        });
      }

      if (!user['isActive']) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Account is disabled"
            }
          ]
        });
      }

      const isMatch = bcrypt.compareSync(password, user['password']);

      if (!isMatch) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Invalid Credentials"
            }
          ]
        });
      }

      const payload: Payload = {
        id: user['id'],
        firstname: user['firstname'],
        lastname:  user['lastname'],
        username:  user['username'],
        email:  user['email'],
        isActive: user['isActive'],
        askForPass: user['askForPass'],
        isAdmin: user['isAdmin']
      };

      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: process.env.jwtExpiration },
        (err, token) => {
          if (err) throw err;
          let toret = _.clone(payload);
          toret['token'] = token;
          res.json(toret);
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);


function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default router;
