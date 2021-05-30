import User from "../models/User";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import { Op } from "sequelize";

export class userController {
  constructor() {}

  public async create(...params) {
    const [req, res, next] = params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const {
      email,
      password,
      username,
      lastname,
      firstname,
      isActive,
      askForPass,
    } = req.body;
    try {
      let user = await User.findOne({ where: { username: username } });
      if (user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "username already used",
            },
          ],
        });
      } else {
        user = await User.findOne({ where: { email: email } });
        if (user) {
          return res.status(HttpStatusCodes.BAD_REQUEST).json({
            errors: [
              {
                msg: "email already used",
              },
            ],
          });
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      await User.create({
        username: username,
        lastname: lastname,
        firstname: firstname,
        email: email,
        password: hashed,
        isActive: isActive,
        askForPass: askForPass,
        isAdmin: false,
      });
      res.json({ message: "User Registered" });
    } catch (err) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
  public updateUser = (...params) => {
    const [req, res, next] = params;
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const {
      email,
      password,
      username,
      lastname,
      firstname,
      isActive,
      askForPass,
    } = req.body;
    User.findOne({
      where: {
        [Op.or]: [{ email: email }, { username: username }, { id: id }],
      },
    })
      .then(async (user) => {
        if (!user || user["id"] == id) {
          let passtosend = password;
          if (user.previous("password") != passtosend) {
            const salt = await bcrypt.genSalt(10);
            passtosend = await bcrypt.hash(password, salt);
          }
          User.update(
            {
              username: username,
              lastname: lastname,
              firstname: firstname,
              email: email,
              password: passtosend,
              isActive: isActive,
              askForPass: askForPass,
              isAdmin: false,
            },
            { where: { id: id } }
          ).then((User) => {
            res.json({ message: `User ${id} updated`, result: User });
          });
        }
      })
      .catch(() => {
        res.status(500).send({ error: "Email or username already used" });
      });
  };

  public findAllUsers = (...params) => {
    const [req, res, next] = params;

    User.findAll({
      where: { id: { [Op.not]: req["userId"] } },
      attributes: { exclude: ["password"] },
    }).then((users) => {
      res.json({ message: "Users retrieved", result: users });
    });
  };

  public findOneUser = (...params) => {
    const [req, res, next] = params;
    const { id } = req.params;
    User.findOne({ where: { id: id } }).then((user) =>
      res.json({ message: "User retrieved", result: user })
    );
  };

  public deleteUser = (...params) => {
    const [req, res, next] = params;
    const { id } = req.params;
    User.destroy({ where: { id: id } }).then(() => {
      res.json({ message: `User ${id} deleted` });
    });
  };
}
