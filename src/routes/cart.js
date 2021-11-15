const express = require('express')
const { addToCart, getCart, deleteFromCart } = require('../controllers/cart')
const validateJWT = require('../middlewares/validateJWT')
const router = express.Router()

router.use(validateJWT)

router.get('/', getCart)
router.put('/add/:id', addToCart)
router.delete('/delete/:id', deleteFromCart)

module.exports = router