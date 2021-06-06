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


$(document).on('click','#addTransction',async function(){
    const title = $(this).closest('form').find('#title')
    const category = $(this).closest('form').find('#category')
    const date = $(this).closest('form').find('#date')
    const total = $(this).closest('form').find('#total')
    const isConstant =  $(this).closest('form').find('#isConstant')
    const isExpense =  $(this).closest('form').find('#isExpense')
   
    let obj = {
        category: category.val(),
        date: date.val(),
        total: total.val(),
        title: title.val(),
        isExpense: isExpense.val(),
        isConstant: isConstant.val()
    }
    await transactionManager.saveTransaction(obj)
    render.setTemplate("add")
    render.renderData(transactionManager.transactionsData)
}) 

$(document).on('click','.updataTransction',function(){
    const id = $(this).closest('.expense').attr('id')
    const title = $(this).closest('form').find('#title')
    const category = $(this).closest('form').find('#category')
    const date = $(this).closest('form').find('#date')
    const total = $(this).closest('form').find('#total')
    const isConstant =  $(this).closest('form').find('#isConstant')
    const isExpense =  $(this).closest('form').find('#isExpense')
   
    let updateObj = {
        category: category.val(),
        date: date.val(),
        total: total.val(),
        title: title.val(),
        isExpense: isExpense.val(),
        isConstant: isConstant.val()
    }
    mangerTransction.updateTransaction(id.val(), updateObj)

})

$(document).on('click','.deleteTransction',function(){
    const id = $(this).closest('form').find('#title')
    mangerTransction.removeTransaction(id.val())
})
