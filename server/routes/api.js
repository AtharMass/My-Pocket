const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transactions')
var moment = require('moment');

router.post('/transaction', function (request, response) { 
    let data = request.body
    console.log("Date: ",moment(data.date).format('L'))
    let newTrans = new Transaction({
        category: data.category,
        date:  data.date,
        total: data.total,
        title: data.title,
        isExpense: data.isExpense,
        isConstant: data.isConstant
    })
   newTrans.save()
   response.send(`Added`)
})


router.get('/transactions/expense/:isExpense', function (req, res) { // work
    let { isExpense } = req.params
    Transaction.find({ isExpense })
        .exec(function (err, transactions) {
            res.send(transactions)
        })
})

module.exports = router
