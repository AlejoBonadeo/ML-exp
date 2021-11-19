import { Request, Response } from "express";
import Book from "../models/Books";
import error500 from "../helpers/error500";
import { Op } from "sequelize";
import tildeRegex from "../helpers/tildeRegex";

export const createBook = async (req: Request, res: Response) => {
  const book = Book.build(req.body);
  book.setDataValue("sellerId", Number(res.locals.uid));

  try {
    const savedBook = await book.save();

    res.status(201).json({
      ok: true,
      book: savedBook,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();

    res.status(200).json({
      ok: true,
      books,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const editBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        ok: false,
        msg: "El libro no existe",
      });
    }
    if (Number(res.locals.uid) !== book.getDataValue("sellerId")) {
      return res.status(403).json({
        ok: false,
        msg: "Usuario no autorizado",
      });
    }
    book.update({ ...req.body });

    const updatedBook = await book.save();

    res.json({
      ok: true,
      book: updatedBook,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        ok: false,
        msg: "El libro no existe",
      });
    }
    await book.destroy();

    res.status(200).json({
      ok: true,
      msg: "Libro borrado exitosamente",
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id, {
      include: [{ association: "seller" }],
    });

    if (!book) {
      return res.status(404).json({
        ok: false,
        msg: "El libro no existe",
      });
    }
    res.json({
      ok: true,
      book,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const getUserBooks = async (req: Request, res: Response) => {
  try {
    const sellerId = res.locals.uid;
    const books = await Book.findAll({ where: { sellerId } });

    if (!books) {
      return res.status(200).json({
        ok: true,
        books: [],
      });
    }
    res.status(200).json({
      ok: true,
      books,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const getBooksByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  try {
    const books = await Book.findAll({ where: { category } });

    if (!books.length) {
      return res.status(404).json({
        ok: false,
        msg: "No hay libros con esta categoría",
      });
    }
    res.status(200).json({
      ok: true,
      books,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};

export const searchBooks = async (req: Request, res: Response) => {
  const { term } = req.params;
  try {
    const books = await Book.findAll({
      where: {
        title: {
          [Op.iLike]: tildeRegex(term),
        },
      },
    });
    if (!books) {
      return res.status(200).json({
        ok: true,
        term,
        books: [],
      });
    }
    res.status(200).json({
      ok: true,
      term,
      books,
    });
  } catch (error: unknown) {
    error500(res, error as Error);
  }
};
