const { Schema, model } = require("mongoose");


const UserSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    province: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String
    },
    cart: {
        type: [Schema.Types.ObjectId],
        ref: 'Book',
    }
})

module.exports = model('User', UserSchema)