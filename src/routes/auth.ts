import { Router } from "express";
import {
  createUser,
  loginUser,
  renewToken,
  getUserById,
} from "../controllers/auth";
import validateJWT from "../middleware/validateJWT";

const router = Router();

router.post("/new", createUser);
router.post("/", loginUser);

router.use(validateJWT);
router.get("/renew", renewToken);
router.get("/user", getUserById);

export default router;
