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

router.get('/transactions/:isExpense', function (req, res) {
    let { isExpense } = req.params
    Transaction
        .find({ isExpense })
        .sort({_id: -1})
        .exec(function (err, transactions) {
            res.send(transactions)
        })
})

router.get('/transactions/:isExpense', function (req, res) {
    let { isExpense } = req.params
    let {isConstant} = req.query
    Transaction.find({ isExpense ,isConstant })
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

router.put('/transaction/:id',async function (request, response) {
    let data = request.body
    let { id } = request.params
    let result = {}
     let updateObj = await Transaction.updateOne({ _id: id },
        {
            $set:
           { 
                category : data.category,
                date : data.date ,
                total : data.total ,
                title : data.title,
                isExpense : data.isExpense,
                isConstant : data.isConstant
           }
        })   
        if(updateObj.ok === 1){
            result.code = 200
            result.msg = 'Your Data has been successfuly updated'
        }else{
            result.code = 442
            result.msg = 'Faield to update your data'
        }
        response.send(result)  
})

module.exports = router
