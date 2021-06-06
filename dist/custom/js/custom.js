$('#sidebarnav').on('click',".sidebar-item", function(){

    $("li").removeClass('selected');
    $("li").find("div").removeClass('active');
    $('.container-fluid').empty()

    const id = $(this).find("div").text().trim()

    const source = $(`#${id.toLowerCase()}-template`).html()
    const template = Handlebars.compile(source)
    const newHTML = template()
    
    $('.page-title').text(id)
    $('.container-fluid').append(newHTML )

    $(this).addClass('selected')
    $(this).find("div").addClass('active')
})

$(document).on('change','#isExpense',function(){
    console.log($(this).val());  
})

$(document).on('change','#isConstant',function(){
    console.log($(this).val());  
})

    

// $(document).ready(function () {

//     $('#select').selectize(
//         {
//         plugins: ['remove_button'],
//         delimiter: ',',
//         persist: false,
//         create: function(input){
//             return{value:input,text:input}
//         },
//         render:{
//             item: function(data,escape){
//                 return'<div>"'+escape(data.text)+'"</div>';
//             }
//         }
//     });
// })