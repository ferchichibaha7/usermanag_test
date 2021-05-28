import { sequelize } from "../../config/database";
import { DataTypes } from "sequelize";

export interface IUser extends Document {
  email: string;
  password: string;
}

const User = sequelize.define("users", {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
},{scopes: {
  withoutPassword: {
    attributes: { exclude: ['password'] },
  }
}});

export default User;