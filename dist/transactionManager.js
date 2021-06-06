class TransactionManager {

    constructor() {
        this.transactionsData = []
    }

    getTransactionExpenseFromDB = async function (isExpense) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $.get(`/transactions/expense/${isExpense}`)
                data.forEach((el) => {
                    el.date =  moment(el.date).format('DD-MM-YYYY')
                })
                this.transactionsData = data
                resolve(data)
            }catch(e) {
                reject(e)
            }
        });
    }

    saveTransaction = async function(data){
        await $.post('/transaction',data, function (res) {

            if(res.code === 200){
                Swal.fire({
                    icon: 'success',
                    title: `Nice, ${res.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: `Oops..., Something went wrong!`,
                    text: `${res.message}`,  
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