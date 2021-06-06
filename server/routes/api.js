

const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transactions')


router.post('/transaction', function (request, response) { 
    let data = request.body
    let newTrans = new Transaction({
        category: data.category,
        date: data.date,
        total: data.total,
        title: data.title,
        isExpense: data.isExpense,
        isConstant: data.isConstant
    })
   newTrans.save()
   response.send(`Added`)
})


module.exports = router