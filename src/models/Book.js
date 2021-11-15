const { Schema, model } = require("mongoose");

const BookSchema = Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isUsed: {
        type: Boolean,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

BookSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})

module.exports = model('Book', BookSchema)