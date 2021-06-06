class TransactionManager {

    constructor() {
        this.transactionsData = []
    }

    getTransactionExpenseFromDB = async function (isExpense) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $.get(`/transactions/expense/${isExpense}`)
                this.transactionsData = data
                resolve(data)
            }catch(e) {
                reject(e)
            }
        });
    }

    saveTransaction = async function(data){
        await $.post('/transaction',data, function (res) {
            console.log(res);
            if(res === "Added"){
                Swal.fire({
                    icon: 'success',
                    title: `Your ${data.title} data has been saved`,
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        })
    }

    removeTransaction = async function (id,isExpense) { 
        return new Promise(async (resolve, reject) => {
            try {
                const deleteActionResp = await $.ajax({
                    url: `transaction/${id}`,
                    type: 'DELETE'
                });
                await this.getTransactionExpenseFromDB(isExpense)
                resolve(this.transactionsData)
            } catch (e) {
                reject(e)
            }
        });
    }

    updateTransaction = async function (id,updateObj) { 
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