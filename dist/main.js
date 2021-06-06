




const render = new Renderer()
const transactionManager = new TransactionManager()


$('.addTransction').on('click', function () {
    let categoryForm = "Food"
    let dateForm = 10-01-2020
    let totalForm = 23444
    let titleForm = "Hamosad"
    let isExpenseForm = true
    let isConstantForm = true

 
    let obj = {
        category: categoryForm,
        date: dateForm,
        total: totalForm,
        title: titleForm,
        isExpense: isExpenseForm,
        isConstant: isConstantForm
    }
    transactionManager.saveTransaction(obj)
    // render.renderData(transactionManager.transactionsData)
})