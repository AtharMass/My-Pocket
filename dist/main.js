




const render = new Renderer()
const transactionManager = new TransactionManager()

$('#sidebarnav').on('click',".sidebar-item", function(){
    $("li").removeClass('selected')
    $("li").find("div").removeClass('active')
    $(this).addClass('selected')
    $(this).find("div").addClass('active')

    const id = $(this).find("div").text().trim().toLowerCase()

    if(id == "expenses"){
        transactionManager.getTransactionExpenseFromDB("true")
    }
})


$('form').on('click','#addTransction',function(){
    const title = $(this).closest('form').find('#title').text
    console.log(title)
    const category = $(this).closest('form').find('#category').text
    console.log(category)
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
}) 
