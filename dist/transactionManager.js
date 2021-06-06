




class TransactionManager {

    constructor() {
        this.transactionsData = []
    }

    getTransactionExpenseFromDB = async function (isExpense) {
        const data =  await $.get(`/transactions/expense/${isExpense}`)
        this.transactionsData = data
    
    }

    saveTransaction = async function(data){
        console.log(data);
        await $.post('/transaction',data, function (res) {
        
            alert("transactionManger",res)
        })
    }

}