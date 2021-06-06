




class TransactionManager {

    constructor() {
        this.transactionsData = []
    }

    getTransactionExpenseFromDB = async function (isExpense) { 
        await $.get(`/transactions/expense/${isExpense}`,function(req,res){
            console.log(req); 
            console.log(res);
        })  
    }

    saveTransaction = async function(data){
        console.log(data);
        await $.post('/transaction',data, function (res) {
        
            alert("transactionManger",res)
        })
    }

}