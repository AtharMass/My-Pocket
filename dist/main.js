const render = new Renderer()
const transactionManager = new TransactionManager()

let idTemplate = "expenses"
let isExpense = false

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
    if(idTemplate === "dashboard"){
        countExpensesAndIncomes()
        expenseCountIsConstant()
        incomeConstAndIncomeIsConst()
        sumTransactions()
        
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
    await expenseCountIsConstant()
    await incomeConstAndIncomeIsConst()
    await sumTransactions()
})

// ***************** Filter ***************** //
 $(document).on('click','#filterData',async function(){
    let searchObj = {isExpense: isExpense}
    let title = $(this).closest(".card").find("#title-filter")
    searchObj.title = (title.val() ?? '') !== '' ? title.val() : undefined
    let category = $(this).closest(".card").find("#category-filter")
    searchObj.category = (category.val() ?? '') !== '' ? category.val() : undefined
    let minTotal = $(this).closest(".card").find("#min-total")
    searchObj.minTotal = (minTotal.val() ?? '') !== '' ? minTotal.val() : undefined
    let maxTotal = $(this).closest(".card").find("#max-total")
    searchObj.maxTotal = (maxTotal.val() ?? '') !== '' ? maxTotal.val() : undefined
    let isConstant = $(this).closest(".card").find("#isConstant-filter")
    searchObj.isConstant = (isConstant.val() ?? '') !== '' ? isConstant.val() : undefined
    let fromDate = $(this).closest(".card").find("#from-date")
    searchObj.fromDate = (fromDate.val() ?? '') !== '' ? fromDate.val() : undefined
    let toDate = $(this).closest(".card").find("#to-date")
    searchObj.toDate = (toDate.val() ?? '') !== '' ? toDate.val() : undefined
   
    console.log(searchObj)
  
    const data = await transactionManager.searchTransaction(searchObj)
    data.forEach((el) => {
        el.date = moment(el.date).format('YYYY-MM-DD')
    })
    transactionManager.transactionsData = data
    render.setTemplate(idTemplate)
    render.renderData(transactionManager.transactionsData)
}) 


$(document).on('click','#reset',async function(){
  let dd = await transactionManager.getTransactionExpenseFromDB(isExpense)
  render.setTemplate(idTemplate)
  render.renderData(dd)
})

const countExpensesAndIncomes = async () => {

    const countExpenses = await  transactionManager.getTransactionExpenseFromDB(true)
    const countIncomes = await  transactionManager.getTransactionExpenseFromDB(false)

    const ctx =  $('#expensesIncomesChart')
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `Expense - ${countExpenses.length}`,
                `Incomes - ${countIncomes.length}`,
              ],            
            datasets: [{
                label: 'My First Dataset',
                data: [
                    countExpenses.length, 
                    countIncomes.length],
                backgroundColor: [
                  'pink',
                  '#61bacf'
                ],
                hoverOffset: 4
            }]
        }
    });

    return myChart
}

const incomeConstAndIncomeIsConst = async () => {

    const countIncomesConstant = await  transactionManager.getTransactionExpenseConstantFromDB(true,isExpense)
    const countIncomesNotConstant = await  transactionManager.getTransactionExpenseConstantFromDB(false,isExpense)

    console.log(!isExpense)

    const ctx =  $('#incomeIsConstantChart')
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `Incomes Constant - ${countIncomesConstant}`,
                `Incomes Not Constant - ${countIncomesNotConstant}`,
              ],            
            datasets: [{
                data: [
                    countIncomesConstant, 
                    countIncomesNotConstant],
                backgroundColor: [
                  '#faa80d',
                  '#01a6cf'
                  
                ],
                hoverOffset: 4
            }]
        }
    });

    return myChart
}

const sumTransactions = async () => {

    const sumExpenses = await  transactionManager.getSumTransactionFromDB(isExpense)
    const sumIncomes = await  transactionManager.getSumTransactionFromDB(!isExpense)


    const ctx =  $('#sumCharts')
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `Expense Total- ${sumExpenses}`,
                `Incomes Total - ${sumIncomes}`,
              ],            
            datasets: [{
                data: [
                    sumExpenses, 
                    sumIncomes],
                backgroundColor: [
                  'red',
                  'green'
                  
                ],
                hoverOffset: 4
            }]
        },
        legend: {
            labels: {
                fontColor: 'black',
                fontSize: "15px"
            }
        }

    });

    return myChart
}

const expenseCountIsConstant = async () => {

    const countExpenses = await  transactionManager.getTransactionExpenseConstantFromDB(true,!isExpense)
    const countIncomes = await  transactionManager.getTransactionExpenseConstantFromDB(false, !isExpense)
    const ctx =  $('#expensesIsConstantChart')
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `Expense Constant - ${countExpenses}`,
                `Expense Not Constant - ${countIncomes}`,
              ],            
            datasets: [{
                label: 'My First Dataset',
                data: [
                    countExpenses, 
                    countIncomes],
                backgroundColor: [
                  '#3dbcbf',
                  '#a7c101'
                ],
                hoverOffset: 4
            }]
        }
    });

    return myChart
}
