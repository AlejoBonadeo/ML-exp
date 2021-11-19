import { Request, Response } from "express";
import User from "../models/User";
import error500 from "../helpers/error500";
import db from "../database/config";
import Book from "../models/Books";

export const getCart = async (req: Request, res: Response) => {
  try {
    const user = (await User.findByPk(res.locals.uid, {
      include: [{ association: "cart" }],
      nest: true,
    })) as any;

    const cart = user.cart?.map((book: any) => book.dataValues);

    if (cart?.length) {
      return res.status(200).json({
        ok: true,
        cart,
      });
    }
    res.status(200).json({
      ok: true,
      cart: [],
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res.status(400).json({
      ok: false,
      msg: "Libro inválido",
    });
  }
  try {
    const book = await Book.findOne({ where: { id } });

    if (!book) {
      return res.status(404).json({
        ok: false,
        msg: "El libro no existe",
      });
    }
    if (book.getDataValue("sellerId").toString() === res.locals.uid) {
      return res.status(400).json({
        ok: false,
        msg: "No podés comprar tu propio libro",
      });
    }
    const user = (await User.findByPk(res.locals.uid, {
      include: [{ association: "cart" }],
      nest: true,
    })) as any;

    const cart = user.cart?.map((book: any) => book.dataValues);

    if (cart?.find((book: any) => book.id === Number(id))) {
      return res.status(400).json({
        ok: false,
        msg: "El libro ya está en el carrito",
      });
    }
    await db.query(
      "INSERT INTO user_book VALUES(DEFAULT, DEFAULT, DEFAULT, ?, ? )",
      {
        replacements: [res.locals.uid, id],
      }
    );
    const newCart = [...cart, book];

    res.status(200).json({
      ok: true,
      cart: newCart,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const deleteFromCart = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res.status(400).json({
      ok: false,
      msg: "Libro inválido",
    });
  }
  try {
    await db.query("DELETE FROM user_book WHERE userId = ? and bookId = ?", {
      replacements: [res.locals.uid, id],
    });

    res.status(200).json({
      ok: true,
      message: "Borrado correctamente",
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};
