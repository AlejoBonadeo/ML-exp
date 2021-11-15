const express = require('express')
const { check } = require('express-validator')
const { createBook, getBooks, editBook, deleteBook, getBookByid, getBooksByCategory, getUserBooks, searchBooks } = require('../controllers/books')
const validateForm = require('../middlewares/validateForm')
const validateJWT = require('../middlewares/validateJWT')
const router = express.Router()

//TODO validar esto con express-validator

router.get('/', getBooks)
router.get('/:id', getBookByid)
router.get('/category/:category', getBooksByCategory)
router.get('/search/:term', searchBooks)

router.use(validateJWT)

router.get('/user/selling', getUserBooks)
router.put('/:id', editBook)
router.post(
    '/',
    [
        check('title', 'Por favor envie un título valido').isLength({ min: 5 }),
        validateForm
    ],
    createBook
)
router.delete('/:id', deleteBook)

module.exports = router