import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import User from "../../models/User";
import auth from "../../middleware/auth";

const router: Router = Router();



router.get("/", auth, async (req, res) => {
  try {
    let user   = await User.findOne({ where:{ id : req['userId'] },attributes: {exclude: ['password']}});
    res.json({ message: "User retrieved", result: user })
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }

});


router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user   = await User.findOne({ where:{ email : email }});

      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Invalid Credentials"
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
        userId: user['id']
      };

      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: process.env.jwtExpiration },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
