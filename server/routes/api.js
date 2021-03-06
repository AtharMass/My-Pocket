const express = require('express')
const router = express.Router()
const Transaction = require('../models/Transactions')
const moment = require('moment')

router.post('/transaction', function (request, response) {
    let data = request.body
    let result = {}
    let newTrans = new Transaction({
        category: data.category,
        date: data.date || moment(),
        total: data.total,
        title: data.title,
        isExpense: data.isExpense,
        isConstant: data.isConstant
    })
    if (data.title !== '' && data.total !== '' && data.category !== '') {
        const savePromise = newTrans.save()
        savePromise.then(saved => {

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
        .sort({ date: -1 })
        .exec(function (err, transactions) {
            res.send(transactions)
        })
})

router.get('/count/:isConstant/:isExpense', function (req, res) {
    let { isConstant,isExpense } = req.params
    let result = {}
    let countPromise = Transaction
        .find(
            {
                $and:
                    [
                        { isExpense: isExpense },
                        { isConstant: isConstant }
                    ]
            }
        )
        .countDocuments()
    countPromise.then(function (count) {
        result.code = 200
        result.count = count
        res.send(result)
    }).catch(function(err){
        console.log(err);
    })

})

router.get('/sum/:isExpense', function (req, res) {
    let { isExpense } = req.params
    let result = {}
  
    let sumPromise = Transaction
        .find(
            
            { isExpense: isExpense },
            {total: 1 , _id:0}
        )
    sumPromise.then(function (sum) {
        let sumExpenses = 0
        for (const obj of sum) {
            sumExpenses += obj.total
        }
        result.code = 200
        
        result.sumExpenses = sumExpenses
        res.send(result)
        
    }).catch(function(err){
        console.log(err);
    })

})

router.get('/filter/transactions', function (req, res) {
    let filterData = req.query
    let filters = []
    let obj = {}
    for (const key in filterData) {
        if (key === 'minTotal' && filterData[`${key}`] != undefined) {
            filters = [...filters, { total: { $gt: filterData[`${key}`] } }]
        } else if (key === 'maxTotal' && filterData[`${key}`] != undefined) {
            filters = [...filters, { total: { $lt: filterData[`${key}`] } }]
        } else if (key === 'fromDate' && filterData[`${key}`] != undefined) {
            filters = [...filters, { date: { $gt: filterData[`${key}`] } }]
        } else if (key === 'toDate' && filterData[`${key}`] != undefined) {
            filters = [...filters, { date: { $lt: filterData[`${key}`] } }]
        } else if (filterData[`${key}`] != undefined) {
            obj[`${key}`] = filterData[`${key}`]
            filters = [...filters, obj]
            obj = {}
        }
    }
    Transaction.find({ $and: filters })
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

router.put('/transaction/:id', async function (request, response) {
    let data = request.body
    let { id } = request.params
    let result = {}
    let updateObj = await Transaction.updateOne({ _id: id },
        {
            $set:
            {
                category: data.category,
                date: data.date,
                total: data.total,
                title: data.title,
                isExpense: data.isExpense,
                isConstant: data.isConstant
            }
        })
    if (updateObj.ok === 1) {
        result.code = 200
        result.msg = 'Your Data has been successfuly updated'
    } else {
        result.code = 442
        result.msg = 'Faield to update your data'
    }
    response.send(result)
})

module.exports = router
