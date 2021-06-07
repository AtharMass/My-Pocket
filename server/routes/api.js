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
        .sort({ _id: -1 })
        .exec(function (err, transactions) {
            res.send(transactions)
        })
})

router.get('/filter/transactions', function (req, res) {
    let filterData = req.query

 
    // dateOperator : dateOperator,
    // totalOperator : totalOperator
    console.log(filterData.category)
    if(filterData.category && filterData.title && filterData.firstDate && filterData.lastDate && filterData.startfirsTtotal && filterData.lastTotal && filterData.isConstant){

    }

    Transaction.find({ isExpense, isConstant })
    let filters = []

    // ---  Search by Category  -----------
    if (filterData.Category) {
        let category = filterData.Category
        filters.push({ Category: category })
    }

    // ---  Search by Salary  -----------
    if (filterData.Salary) {
        let salary = filterData.Salary
        filters.push({ Salary: salary })
    }

    // ---  Search by Title  -----------
    if (filterData.Title) {
        let title = filterData.Title
        filters.push({ Title: title })
    }

    // ---  Search by sepcific Date  -----------
    if (filterData.Date) { // search by one day
        let date = filterData.Date
        filters.push({ Date: date })
    }

    // ---  Search by   -----------
    else {
        if (filterData.firstDate && filterData.lastDate) {
            let start = filterData.firstDate
            let end = filterData.lastDate
            if (start > end) {
                console.log("Sorry can't search it !\nstart date is bigger than the last date");
                res.send("error")
            }
            else {
                filters.push({ Date: { $gte: start } })
                filters.push({ Date: { $lte: end } })
            }
        }
    }

    // ---  Search by flag - isConstant  -----------
    if (filterData.isConstant) {
        let constt = JSON.parse(filterData.isConstant)
        filters.push({ isConstant: constt })
    }

    // ---  Search by flag - isExpense  -----------
    if (filterData.isExpense) {
        let exp = JSON.parse(filterData.isExpense)
        filters.push({ isExpense: exp })
    }

    //------------ begin to search : 
    Transaction.find({ $and: filters }).exec(function (err, transactions) {
        console.log("err =", err);
        console.log("the array = ", transactions);
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
