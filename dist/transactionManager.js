

class TransactionManager {

    constructor() {
        this.transactionsData = []
    }

    getTransactionExpenseFromDB = async function (isExpense) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await $.get(`/transactions/${isExpense}`)
                data.forEach((el) => {
                    el.date = moment(el.date).format('YYYY-MM-DD')
                })
                this.transactionsData = data
                resolve(data)
            } catch (e) {
                reject(e)
            }
        });
    }

    saveTransaction = async function (data) {
        await $.post('/transaction', data, function (res) {
            if (res.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: `Nice, ${res.message}`,
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
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

    removeTransaction = async function (id, isExpense) {
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

    updateTransaction = async function (id, updateObj) {
        return new Promise(async (resolve, reject) => {
            try {
                const updateActionResp = await $.ajax({
                    url: `transaction/${id}`,
                    data: updateObj,
                    type: 'PUT'
                });
                await this.getTransactionExpenseFromDB(updateObj.isExpense)
                resolve(this.transactionsData)
                if (updateActionResp.code == 200) {
                    Swal.fire({
                        icon: 'success',
                        title: `Nice, ${updateActionResp.msg}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: `Oops..., Something went wrong!`,
                        text: `${updateActionResp.msg}`,
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            } catch (e) {
                reject(e)
            }
        });
    }

    searchTransaction = async function (searchObj) {
        const data = await $.get('/filter/transactions' , searchObj, function(req,res){
            console.log(res);
        })
        return data
    }
}