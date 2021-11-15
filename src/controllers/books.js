const { isValidObjectId } = require("mongoose")
const error500 = require("../helpers/error500")
const tildeRegex = require("../helpers/tildeRegex")
const Book = require("../models/Book")



const getBooks = async (req, res) => {
    try {
        const books = await Book.find()
    
        res.status(200).json({
            ok: true,
            books
        })
        
    } catch (error) {
        error500(res, error)
    }
}

const createBook = async  (req, res) => {
    const book = new Book(req.body)

    try {
        book.seller = req.uid
        const savedBook = await book.save()
        res.status(201).json({
            ok: true,
            book: savedBook
        })
    } catch (error) {
        error500(res, error)
    }
}

const editBook = async (req, res) => {

    const { id } = req.params

    if(!isValidObjectId(id)) {
        return res.status(404).json({
            ok: false,
            msg: 'El libro no existe'
        })
    }

    try {
        const book = await Book.findById(id)

        if(!book) {
            return res.status(404).json({
                ok: false,
                msg: 'El libro no existe'
            })
        }

        if(req.uid !== book.seller.toString()) {
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            })
        }

        const newBook = {
            ...req.body,
            user: req.uid
        }

        const editedBook = await Book.findByIdAndUpdate(id, newBook, { new: true })

        res.status(200).json({
            ok: true,
            book: editedBook
        })
    } catch (error) {
        error500(res, error)
    }
}

const deleteBook = async (req, res) => {
    const { id } = req.params

    if(!isValidObjectId(id)) {
        return res.status(404).json({
            ok: false,
            msg: 'El libro no existe'
        })
    }

    try {
        const book = await Book.findById(id)

        if(!book) {
            return res.status(404).json({
                ok: false,
                msg: 'El libro no existe'
            })
        }
        if(req.uid !== book.seller.toString()){
            return res.status(403).json({
                ok: false,
                msg: 'Usuario no autorizado'
            })
        }

        await Book.findByIdAndDelete(id)

        res.status(200).json({
            ok: true,
            msg: 'Libro eliminado'
        })

    } catch (error) {
        error500(res, error)
    }
}

const getBookByid = async (req, res) => {

    const { id } = req.params

    if(!isValidObjectId(id)) {
        return res.status(404).json({
            ok: false,
            msg: 'El libro no existe'
        })
    }

    try {
        const book = await Book.findById(id).populate('seller', 'firstName province')
        
        if(!book) {
            return res.status(404).json({
                ok: false,
                msg: 'El libro no existe'
            })
        }

        res.status(200).json({
            ok: true,
            book
        })
    } catch (error) {
        error500(res, error)
    }
}

const getBooksByCategory = async (req, res) => {
    
    const { category } = req.params
    try {
        const books = await Book.find({ category })

        if(!books.length) {
            return res.status(404).json({
                ok: false,
                msg: 'No hay libros con esa categoría'
            })
        }
        res.status(200).json({
            ok: true,
            books
        })

    } catch (error) {
        error500(res, error)
    }
}

const getUserBooks = async (req, res) => {
    try {
        const seller = req.uid
        const books = await Book.find({ seller })

        if(!books) {
            return res.status(200).json({
                ok: true,
                books: []
            })
        }

        res.status(200).json({
            ok: true,
            books
        })
    } catch (error) {
        error500(res, error)
    }
}
const searchBooks = async (req, res) => {
    const { term } = req.params
    try {
        const books = await Book.find({ title: {
            $regex: tildeRegex(term),
            $options: 'i'
        }})

        if(!books) {
            return res.status(200).json({
                ok: true,
                term,
                books: []
            })
        }
        res.status(200).json({
            ok: true,
            term,
            books
        })

    } catch (error) {
        error500(res, error)
    }
}

module.exports = { 
    createBook,
    getBooks,
    editBook,
    deleteBook,
    getBookByid,
    getBooksByCategory,
    getUserBooks,
    searchBooks
}