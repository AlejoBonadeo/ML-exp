const User = require("../models/User")
const argon2 = require('argon2')
const generateJWT = require("../helpers/jwt")
const error500 = require("../helpers/error500")

const createUser = async (req, res) => {
    const { email, password, dni } = req.body

    try {
        let user = await User.findOne({ email }) || await User.findOne({ dni })

        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'EL email o dni ya están registrados'
            })
        }

        user = new User(req.body)

        user.password = await argon2.hash(password)

        await user.save()

        const token = await generateJWT(user.id, user.firstName)

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.firstName,
            token
        })
    } catch (error) {
        error500(res, error)
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos'
            })
        }

        if(!await argon2.verify(user.password, password)) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos'
            })
        }

        const token = await generateJWT(user.id, user.firstName)

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.firstName,
            token
        })

    } catch (error) {
        error500(res, error)
    }
}

const renewToken = async (req, res) => {
    const { uid, name } = req
    try {
        const token = await generateJWT(uid, name)
    
        res.status(200).json({
            ok: true,
            uid,
            name,
            token
        })
    } catch (error) {
        error500(res, error)
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.uid)
        res.status(200).json({
            ok: true,
            user
        })
    } catch (error) {
        error500(res, error)
    }
}

module.exports = {
    createUser,
    loginUser,
    renewToken,
    getUserById
}