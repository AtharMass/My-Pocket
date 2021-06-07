const render = new Renderer()
const transactionManager = new TransactionManager()

let idTemplate = "expenses"
let isExpense = true

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
        isExpense = true
    }else{
        isExpense = false
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

$(document).on('click','#editTransction',async function(){
    const id = $(this).closest('.form-edit').attr("id")
    const title = $(this).closest('.form-edit').find('#edit-title')
    const category = $(this).closest('.form-edit').find('#edit-category')
    const date = $(this).closest('.form-edit').find('#edit-date')
    const total = $(this).closest('.form-edit').find('#edit-total')
    const isConstant =  $(this).closest('.form-edit').find('#edit-isConstant')
    const isExpense =  $(this).closest('.form-edit').find('#edit-isExpense')
   

    let obj = {
        category: category.val(),
        date: date.val(),
        total: total.val(),
        title: title.val(),
        isExpense: isExpense.val(),
        isConstant: isConstant.val()
    }
   
    await transactionManager.updateTransaction(id,obj)
    // render.setTemplate("add")
    // render.renderData(transactionManager.transactionsData)
}) 

$(document).on('click','.updataTransction',function(){
    const idExpense = $(this).closest('.expense').attr("id")
    const idIncome = $(this).closest('.income').attr("id")
    let id = idExpense ?? idIncome
    const type = isExpense ? "expense" : "income"

    const title = $(this).closest(`.${type}`).find('h6').text().trim()
    const category = $(this).closest(`.${type}`).find('.transaction-category').text().trim()
    const total = $(this).closest(`.${type}`).find('.transaction-total').text().trim()
    const date = $(this).closest(`.${type}`).find('.transaction-date').text().trim()
    let isConstant = $(this).closest(`.${type}`).find('small').text().trim()
    isConstant = (isConstant =="Constant")  ? true : false
    
    let obj = [{
        category: category,
        date: date,
        total: total,
        title: title,
        isExpense: isExpense,
        isConstant: isConstant,
        _id : id
    }]

    render.setTemplate("edit")
    render.renderData(obj)
    // transactionManager.updateTransaction(id, updateObj)

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

