import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import booksRouter from "./routes/books";
import cartRouter from "./routes/cart";
import { dbConnection } from "./database/config";
dotenv.config();
const app: Application = express();

/* Database */
dbConnection();

/* MiddleWare */
app.use(cors());
app.use(express.static("src/public"));
app.use(express.json());

/* Routes */
app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/api/cart", cartRouter);

app.listen(process.env.PORT, () => {
  console.log("App listening on port " + process.env.PORT);
});
