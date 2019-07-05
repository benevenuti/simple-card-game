
function iniciarSimpleCardGame() {
    
    console.info(`chamou o main`)

    // registra os eventos globais
    $(document).bind('ajaxStart', function (event) {
        console.info(`${event.type}`)
        // meter aqui um loading massa
    })

    $(document).bind('ajaxComplete', function (event, jqXHR, settings) {
        console.info(`${event.type} >> ${decodeURI(settings.url)}`)
        // esconder o loading
    })

    // init app
    let simple = new Controller(Model, View)

}