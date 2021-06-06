




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
            console.log(res);
        })
    }

    removeTransaction = async function (id) { 
        return $.ajax({
            url: `transaction/${id}`,
            type: 'DELETE',
            success: function (transaction) {
                alert(transaction)
            }
        });
    }

    updateTransaction = async function (id,updateObj) { // good
        return $.ajax({
            url: `transaction/${id}`,
            type: 'PUT',
            data: updateObj,
            success: function (transaction) {
              console.log(transaction);
            }
        });
    }

}