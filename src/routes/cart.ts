import { Router } from "express";
import { getCart, addToCart, deleteFromCart } from "../controllers/cart";
import validateJWT from "../middleware/validateJWT";

const router = Router();

router.use(validateJWT);
router.get("/", getCart);
router.post("/add/:id", addToCart);
router.delete("/delete/:id", deleteFromCart);

export default router;
