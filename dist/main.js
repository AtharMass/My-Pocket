const render = new Renderer()
const transactionManager = new TransactionManager()

let idTemplate = "expenses"
let isExpense = true

const setSelectedItem = function(element){
    $("li").removeClass('selected')
    $("li").find("div").removeClass('active')
    element.addClass('selected')
    element.find("div").addClass('active')
    const id = element.find("div").text().trim()
    $('.page-title').text(id)
    return id.toLowerCase()
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
    if(idTemplate === "dashboard")
        countExpensesAndIncomes()
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
    const isExpenseFromUpdate =  $(this).closest('.form-edit').find('#edit-isExpense')
   

    let obj = {
        category: category.val(),
        date: date.val(),
        total: total.val(),
        title: title.val(),
        isExpense: isExpenseFromUpdate.val(),
        isConstant: isConstant.val()
    }
   
    let objUpdated = await transactionManager.updateTransaction(id,obj)
    const updatedObj = objUpdated.find(o =>  o._id === id)
    isExpense = updatedObj.isExpense
    idTemplate =isExpense ? "expenses" : "incomes"

    await transactionManager.getTransactionExpenseFromDB(isExpense)

    $(".sidebar-item").each(function( indx ) {
        $(".sidebar-item").removeClass('selected')
        $(".sidebar-item").find("div").removeClass('active')

        if (isExpense){
            $(".sidebar-item").find(".expenses").addClass("active")
        }else{
            $(".sidebar-item").find(".incomes").addClass("active")
        }
    })

    render.setTemplate(idTemplate)
    render.renderData(objUpdated)
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

$(document).ready(async function(){
    render.setTemplate("dashboard")
    render.renderData([])

    await countExpensesAndIncomes()
   

    var ctx2 =  $('#myChart2')
    var myChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: [
                'Constant Expense',
                'Not Constant Expense',
              ],            
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50],
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    });
})

const countExpensesAndIncomes = async () => {

    const countExpenses = await  transactionManager.getTransactionExpenseFromDB(true)
    const countIncomes = await  transactionManager.getTransactionExpenseFromDB(false)

    const ctx =  $('#myChart')
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Expense',
                'Incomes',
              ],            
            datasets: [{
                label: 'My First Dataset',
                data: [
                    countExpenses.length, 
                    countIncomes.length],
                backgroundColor: [
                  'rgb(246, 45, 81)',
                  'rgb(43, 158, 58)'
                ],
                hoverOffset: 4
            }]
        }
    });

    return myChart
}

 $(document).on('click','#searchTransction',function(){
    const title = "Drby Bar"
    const category =  "Resturant"
    const firstDate = "20-01-2020"
    const lastDate = "25-01-2020"
    const firsTtotal = 500
    const lastTotal = 700
    const isConstant =  true
    const dateOperator = "="
    const totalOperator = ">"
   
    let searchObj = {
        category : category,
        title : title,
        firstDate: firstDate,
        lastDate: lastDate,
        firsTtotal: firsTtotal,
        lastTotal: lastTotal,
        isConstant: isConstant,
        dateOperator : dateOperator,
        totalOperator : totalOperator
    }

   
    transactionManager.searchTransaction(searchObj)
    // render.setTemplate("search")
    // render.renderData(transactionManager.transactionsData)
}) 


