




const render = new Renderer()
const transactionManager = new TransactionManager()

const setSelectedItem = function(element){
    $("li").removeClass('selected')
    $("li").find("div").removeClass('active')
    element.addClass('selected')
    element.find("div").addClass('active')
    const id = element.find("div").text().trim().toLowerCase()
    return id
}
$('#sidebarnav').on('click',".sidebar-item", async function(){
    let id = setSelectedItem($(this))
    if(id == "expenses"){
        await transactionManager.getTransactionExpenseFromDB("true")
        render.setTemplate(id)
        render.renderData(transactionManager.transactionsData)
    }else{
        await transactionManager.getTransactionExpenseFromDB("false")
        render.setTemplate(id)
        render.renderData(transactionManager.transactionsData)
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
