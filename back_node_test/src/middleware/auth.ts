import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";

export default function(req, res, next) {
  try {
  // Get token from header
  const token = req.headers.authorization.split(" ")[1];
  // Verify token
    const payload: Payload | any = jwt.verify(token, process.env.SECRET);
    req.userId = payload.id;
    req.isAdmin = payload.isAdmin;

    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "Token is not valid" });
  }
}
