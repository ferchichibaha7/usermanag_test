import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();
const pg_db = process.env.PG_DB;
const pg_user = process.env.PG_USER;
const pg_pass = process.env.PG_PASS;
const pg_host = process.env.PG_HOST;

const sequelize = new     Sequelize(pg_db, pg_user, pg_pass, {
  host: pg_host,
  dialect: "postgres",
  logging: false,
});

const connectAuthenticate = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("DataBase Connected");
    })
    .catch((err) => {
      console.log("Error db");
    });
};

export { sequelize, connectAuthenticate };
