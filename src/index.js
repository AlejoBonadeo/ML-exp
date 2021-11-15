const express = require('express')
const cors = require('cors')
const dbConnection = require('./database/config')
require('dotenv').config()
const app = express()

/* Database */
dbConnection()

/* Middleware */
app.use(cors())
app.use(express.static('src/public'))
app.use(express.json())

/* Routes */
app.use('/api/auth', require('./routes/auth'))
app.use('/api/books', require('./routes/books'))
app.use('/api/cart', require('./routes/cart'))

app.get('*', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT, () => {
    console.log('Server running in port ' + process.env.PORT)
})