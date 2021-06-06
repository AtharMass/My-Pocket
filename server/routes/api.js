const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transactions')
const moment = require('moment')




  
router.post('/transaction', function (request, response) { 
    let data = request.body
    let result ={}
    let newTrans = new Transaction({
        category: data.category,
        date:  data.date || moment() ,
        total: data.total,
        title: data.title,
        isExpense: data.isExpense,
        isConstant: data.isConstant
    })
    if ( data.title !== '' && data.total !== '' && data.category !== '') {
        const savePromise = newTrans.save()
        savePromise.then( saved => {
            console.log(saved)
        }).catch(err => {
            console.log(err)
        })
        result.code = 200
        result.message = "The data inserted successfuly"
    } else {
        result.code = 422
        result.message = "All fields are required"
    }

   response.send(result)
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

router.delete('/transaction/:id', function (req, res) { 
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
