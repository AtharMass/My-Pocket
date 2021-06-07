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
    let filters = []
    let obj = {}
    for (const key in filterData) {
        if(key === 'minTotal' && filterData[`${key}`] != undefined) {
            filters = [...filters, { total: {$gt: filterData[`${key}`] }}]
        } else if (key === 'maxTotal' && filterData[`${key}`] != undefined) {
            filters = [...filters, { total: {$lt: filterData[`${key}`] }}]
        } else if(key === 'fromDate' && filterData[`${key}`] != undefined) {
            filters = [...filters, { date: {$gt: filterData[`${key}`] }}]
        } else if (key === 'toDate' && filterData[`${key}`] != undefined) {
            filters = [...filters, { date: {$lt: filterData[`${key}`] }}]
        } else if(filterData[`${key}`] != undefined){
            obj[`${key}`] =  filterData[`${key}`]
            filters = [...filters, obj]
            obj = {}
        }
    } 

    console.log(filters)

    Transaction
    .find(
        {
            $and: filters
        }
    )
    .exec(function (err, transactions) {
        res.send(transactions)
    })


    // dateOperator : dateOperator,
    // totalOperator : totalOperator

    // if(filterData.category && filterData.title && filterData.firstDate && filterData.lastDate && filterData.startfirsTtotal && filterData.lastTotal && filterData.isConstant){

    // }

    // Transaction.find({ isExpense, isConstant })
    
    // let cate = filterData.category
    // // ---  Search by Category  -----------
    // if ( cate !== '' ) {
    //     console.log(cate)
       
    //     filters.push({ category: cate })
    // }

    // let firstNum = filterData.firsTtotal 
    // let secondNum = filterData.lastTotal
    // ---  Search by Salary  -----------
    // if (firstNum !== '' && secondNum !== '') {
    //     $and : [
    //         { }
    //     ]
    //     let salary = filterData.Salary
    //     filters.push({ Salary: salary })
    // }

    // ---  Search by Title  -----------
    // if (filterData.Title) {
    //     let title = filterData.Title
    //     filters.push({ Title: title })
    // }

    // ---  Search by sepcific Date  -----------
    // if (filterData.Date) { // search by one day
    //     let date = filterData.Date
    //     filters.push({ Date: date })
    // }

    // ---  Search by   -----------
    // else {
    //     if (filterData.firstDate && filterData.lastDate) {
    //         let start = filterData.firstDate
    //         let end = filterData.lastDate
    //         if (start > end) {
    //             console.log("Sorry can't search it !\nstart date is bigger than the last date");
    //             res.send("error")
    //         }
    //         else {
    //             filters.push({ Date: { $gte: start } })
    //             filters.push({ Date: { $lte: end } })
    //         }
    //     }
    // }

    // ---  Search by flag - isConstant  -----------
    // if (filterData.isConstant) {
    //     let constt = JSON.parse(filterData.isConstant)
    //     filters.push({ isConstant: constt })
    // }

    // ---  Search by flag - isExpense  -----------
    // if (filterData.isExpense) {
    //     let exp = JSON.parse(filterData.isExpense)
    //     filters.push({ isExpense: exp })
    // }

    //------------ begin to search : 
    // console.log(filters)
    // if (filters.length == 1) {
    //     filterItems = filters[0]
    //     console.log(filterItems)
    // }



    // `{$and : [
    //     { date: $gt: { ${fromDate} } },
    //     { date: $lt: { ${toDate} } },
    // ]}`

    

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
