const mongoose = require("mongoose")

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('DB online')
    } catch (error) {
        console.log(error.message)
        throw new Error('Error when initializing database')
    }
}

module.exports = dbConnection