import argon2 from "argon2";
import { Request, Response } from "express";
import error500 from "../helpers/error500";
import generateJWT from "../helpers/generateJWT";
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  const { body } = req;
  const { email, password, dni } = body;

  try {
    {
      const user =
        (await User.findOne({ where: { email } })) ||
        (await User.findOne({ where: { dni } }));

      if (user) {
        return res.status(400).json({
          ok: false,
          msg: "El email o dni ya están registrados",
        });
      }
    }
    const user = User.build(body);
    user.setDataValue("password", await argon2.hash(password));

    await user.save();

    const token = await generateJWT(
      user.getDataValue("id").toString(),
      body.firstName,
      body.imageUrl
    );

    res.status(201).json({
      ok: true,
      uid: user.getDataValue("id"),
      name: body.firstName,
      imageUrl: body.imageUrl,
      token,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { body } = req;
  const { email, password } = body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Email o contraseña incorrectos",
      });
    }
    if (!(await argon2.verify(user.getDataValue("password"), password))) {
      return res.status(400).json({
        ok: false,
        msg: "Email o contraseña incorrectos",
      });
    }
    const token = await generateJWT(
      user.getDataValue("id").toString(),
      user.getDataValue("firstName"),
      user.getDataValue("imageUrl")
    );

    res.status(200).json({
      ok: true,
      uid: user.getDataValue("id"),
      name: user.getDataValue("firstName"),
      imageUrl: user.getDataValue("imageUrl"),
      token,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const renewToken = async (req: Request, res: Response) => {
  const { uid, name, imageUrl } = res.locals;

  try {
    const token = await generateJWT(uid, name, imageUrl);
    res.status(200).json({
      ok: true,
      uid,
      name,
      imageUrl,
      token,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(res.locals.uid);
    res.status(200).json({
      ok: true,
      user,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};
