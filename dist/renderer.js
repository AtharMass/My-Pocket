class Renderer {

    constructor() {
        this.source =''
        this.template = Handlebars.compile(this.source);
        const filterTemplate = $(`#filter-template`).html()
        Handlebars.registerPartial('filter', filterTemplate);
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