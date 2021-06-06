const mongoose = require('mongoose')
const Schema = mongoose.Schema


const transctionsSchema = new Schema({ 
        category : {type: String , required: true , min :3},
        date : {type: Date, required : true},
        total : {type: Number,min:0, required: true },
        title : {type: String , required: true ,min :3},
        isExpense: {type: Boolean, required: true },
        isConstant : {type: Boolean, required: true }
  })
const Transaction = mongoose.model("transaction", transctionsSchema)
module.exports = Transaction

