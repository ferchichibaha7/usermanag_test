import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

import { sequelize, connectAuthenticate } from "../config/database";
import login from "./routes/api/login";
import user from "./routes/api/user";
import User from "./models/User";

const app = express();

// Connect to DB
connectAuthenticate();
sequelize.sync();

// Express configuration
app.use(cors());
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", login);
app.use("/api/user", user);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

// create admin if not exist on start server 
function upsert(values, condition) {
  return User
      .findOne({ where: condition })
      .then(async function(obj) {
        const salt = await bcrypt.genSalt(10);
        values.password = await bcrypt.hash(values.password, salt);
          // update
          if(obj)
              return obj.update(values);
          // insert
          return User.create(values);
      })
}

upsert({ 
  "email": "admin@gmail.com",
  "password": "adminadmin",
  "firstname": "admin firstname",
  "lastname": "admin lastname",
  "username": "admin",
  "isAdmin": true,
  "isActive": true,
  "askForPass": false
}, { username: 'admin' })

export default server;
