import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserPayload from "../interfaces/UserPayload";

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Debes Iniciar Sesión",
    });
  }
  try {
    const { uid, name, imageUrl } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED as string
    ) as UserPayload;

    res.locals.uid = uid;
    res.locals.name = name;
    res.locals.imageUrl = imageUrl;
  } catch (error: unknown) {
    return res.status(401).json({
      ok: false,
      msg: "Debes iniciar sesión",
    });
  }
  next();
};

export default validateJWT;
