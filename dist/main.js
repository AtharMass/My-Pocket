const render = new Renderer()
const transactionManager = new TransactionManager()

let idTemplate = "expenses"
let isExpense = "true"

const setSelectedItem = function(element){
    $("li").removeClass('selected')
    $("li").find("div").removeClass('active')
    element.addClass('selected')
    element.find("div").addClass('active')
    const id = element.find("div").text().trim().toLowerCase()
    return id
}

const checkIfExpense = function (){
    if(idTemplate == "expenses"){
        isExpense = "true"
    }else{
        isExpense = "false"
    }
}

$('#sidebarnav').on('click',".sidebar-item", async function(){
    idTemplate = setSelectedItem($(this))
    checkIfExpense()
    await transactionManager.getTransactionExpenseFromDB(isExpense)
    render.setTemplate(idTemplate)
    render.renderData(transactionManager.transactionsData)
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
    transactionManager.updateTransaction(id, updateObj)

})

$(document).on('click','.deleteTransction',function(){
    const idExpense = $(this).closest('.expense').attr("id")
    const idIncome = $(this).closest('.income').attr("id")
    let id = idExpense ?? idIncome

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await transactionManager.removeTransaction(id,isExpense)

            Swal.fire(
                'Deleted!',
                `The data has been deleted. 😔`,
                'success'
            )
           
            
            render.setTemplate(idTemplate)
            render.renderData(transactionManager.transactionsData)
        
            //console.lo
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            Swal.fire(
                'Cancelled',
                `Your data is safe. 😄`,
                'error'
            )
        }
        
    })

})

