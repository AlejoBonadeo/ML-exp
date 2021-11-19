import { Router } from "express";
import {
  createBook,
  getBooks,
  editBook,
  deleteBook,
  getBookById,
  getUserBooks,
} from "../controllers/books";
import validateJWT from "../middleware/validateJWT";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

router.use(validateJWT);

router.post("/", createBook);
router.put("/:id", editBook);
router.delete("/:id", deleteBook);
router.get("/user/selling", getUserBooks);

export default router;
