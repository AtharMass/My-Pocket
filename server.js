const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const api = require('./server/routes/api')

const app = express()
const PORT = 8080

mongoose.connect("mongodb://localhost/transactions",{ useNewUrlParser: true , useUnifiedTopology: true})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)


/*=====================================================
Start the server:
=======================================================*/

app.listen(PORT, function() {
    console.log(`Server up and running on port ${PORT}`)
})
  