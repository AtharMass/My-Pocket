class Renderer {

    constructor() {
        this.source =''
        this.template = Handlebars.compile(this.source);
    }
    renderData(transactions) {
        $('.container-fluid').empty()
        const newHTML = this.template({ transactions })
        $('.container-fluid').append(newHTML);
    }
    setTemplate(templateId){
         this.source = $(`#${templateId}-template`).html()
         this.template = Handlebars.compile(this.source) 
    }

}