const path = require('path')
var express = require('express')
var mongoose = require('mongoose')
const api = require('./server/routes/api')

var app = express()
const PORT = 3555

mongoose.connect("mongodb://localhost/transactions")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

//app.use('/', api)


/*=====================================================
Start the server:
=======================================================*/

app.listen(PORT, function() {
    console.log(`Server up and running on port ${PORT}`)
})
  