import bodyParser from "body-parser";
import express from "express";

import { sequelize, connectAuthenticate } from "../config/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";

const app = express();

// Connect to DB
connectAuthenticate();
sequelize.sync();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
