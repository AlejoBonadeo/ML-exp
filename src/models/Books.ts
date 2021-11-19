import { DataTypes } from "sequelize";
import db from "../database/config";
import User from "./User";

const Book = db.define("book", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  author: {
    type: DataTypes.STRING,
  },
  publisher: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.INTEGER,
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  sellerId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});
Book.belongsTo(User, {
  as: "seller",
  foreignKey: "sellerId",
});
User.hasMany(Book, {
  as: "seller",
  foreignKey: "sellerId",
});
User.belongsToMany(Book, {
  as: "cart",
  through: "user_book",
  foreignKey: "userId",
  otherKey: "bookId",
});
export default Book;
