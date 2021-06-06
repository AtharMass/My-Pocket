const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transactions')
var moment = require('moment');

router.post('/transaction', function (request, response) { 
    let data = request.body
    // console.log("Date: ",moment(data.date).format('L'))
    let newTrans = new Transaction({
        category: data.category,
        date:  data.date,
        total: data.total,
        title: data.title,
        isExpense: data.isExpense,
        isConstant: data.isConstant
    })
    const savePromise = newTrans.save()
    savePromise.then( saved => {
        console.log(saved)
    }).catch(err => {
        console.log(err)
    })
   response.send(`Added`)
})


router.get('/transactions/expense/:isExpense', function (req, res) {
    let { isExpense } = req.params
    Transaction
        .find({ isExpense })
        .sort({_id: -1})
        .exec(function (err, transactions) {
            res.send(transactions)
        })
})

router.delete('/transaction/:id', function (req, res) { // work
    let { id } = req.params
    Transaction.deleteOne({ _id: id })
        .exec((err, success) => {
            if (success === null) {
                res.send(`Not find`)
            } else {
                res.send(`Delete`)
            }
        })
})

module.exports = router
