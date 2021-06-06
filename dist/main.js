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


$(document).on('click','#addTransction',function(){
    const title = $(this).closest('form').find('#title')
    const category = $(this).closest('form').find('#category')
    const date = $(this).closest('form').find('#date')
    const total = $(this).closest('form').find('#total')
    let isExpenseForm = true
    let isConstantForm = true

    let obj = {
        category: category.val(),
        date: date.val(),
        total: total.val(),
        title: title.val(),
        isExpense: isExpenseForm,
        isConstant: isConstantForm
    }
    transactionManager.saveTransaction(obj)
}) 


$('.delete').on('click', function () {
    let id = "60bbea18e76e708c8c0beee1"
    mangerTransction.removeTransaction(id)
})
