import { Response } from "express";

const error500 = (res: Response, error: Error) => {
  console.log(error.message);
  res.status(500).json({
    ok: false,
    message: "Ocurrió un error",
  });
};

export default error500;
