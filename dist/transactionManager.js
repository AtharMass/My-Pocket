




class TransactionManager {

    constructor() {
        this.transactionsData = []
    }

    // getTransactionExpenseFromDB = async function () { 
    //     await $.get('/transactions/expense/true',function(req,res){
    //         console.log(req); 
    //         console.log(res);
    //         // res.end()
    //     })  
    // }

    saveTransaction = async function(data){
        console.log(data);
        await $.post('/transaction',data, function (res) {
        
            alert("transactionManger",res)
        })
    }

}