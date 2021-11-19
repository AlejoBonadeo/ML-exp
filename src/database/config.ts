import { Sequelize } from "sequelize";

const db = new Sequelize("mercado_libros_alt", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

export const dbConnection = async () => {
  try {
    await db.authenticate();
    console.log("Database Online");
  } catch (error) {
    console.log(error);
  }
};

export default db;
