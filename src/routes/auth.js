const express = require('express')
const { check } = require('express-validator')
const { createUser, loginUser, renewToken, getUserById } = require('../controllers/auth')
const validateForm = require('../middlewares/validateForm')
const validateJWT = require('../middlewares/validateJWT')
const router = express.Router()

router.post(
    '/',
    [
        check('email', 'Email inválido').isEmail(),
        validateForm
    ],
    loginUser
)
router.post(
    '/new',
    [
        check('firstName', 'Por favor envie un nombre valido').isLength({ min: 2 }),
        check('lastName', 'Por favor envie un nombre valido').isLength({ min: 2 }),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
        validateForm
    ],
    createUser
    )

router.get('/renew', validateJWT, renewToken)
router.get('/user', validateJWT, getUserById)

module.exports = router