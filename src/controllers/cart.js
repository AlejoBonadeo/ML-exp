const error500 = require("../helpers/error500")
const Book = require("../models/Book")
const User = require("../models/User")
const mongoose = require('mongoose')

const addToCart = async (req, res) => {
    const { id } = req.params

    try {
        const book = await Book.findById(id)
        const user = await User.findById(req.uid)

        if(!book) {
            return res.status(404).json({
                ok: false,
                msg: 'El libro no existe'
            })
        }

        if(mongoose.Types.ObjectId(req.uid).toString() == book.seller) {
            return res.status(400).json({
                ok: false,
                msg: 'No podés comprar tu propio libro'
            })
        }

        if(user.cart.find( item => item == id )) {
            return res.status(400).json({
                ok: false,
                msg: 'El libro ya está en el carrito'
            })
        }

        const cart = user.cart?.length ? [ ...user.cart, id ] : [ id ]

        const editedUser = await User.findByIdAndUpdate(req.uid, { cart }, { new: true })

        res.status(200).json({
            ok: true,
            user: editedUser
        })
    } catch (error) {
        error500(res, error)
    }
}

const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.uid).populate('cart')

        if(user.cart) {
            res.status(200).json({
                ok: true,
                cart: user.cart
            })
        } else {
            res.status(200).json({
                ok: true,
                cart: []
            })
        }
    } catch (error) {
        error500(res, error)
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.uid)

        const id = mongoose.Types.ObjectId(req.params.id)
        
        if(!user.cart) {
            user.cart = []
        }
        const cart = user.cart.filter(cartItem => cartItem.toString() !== id.toString())
        await User.findByIdAndUpdate(req.uid, { cart })
        
        res.status(200).json({
            ok: true,
            message: 'Borrado correctamente'
        })

    } catch (error) {
        error500(res, error)
    }
}

module.exports = {
    addToCart,
    getCart,
    deleteFromCart
}