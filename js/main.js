
function iniciarSimpleCardGame() {
    
    console.info(`chamou o main`)

    // registra os eventos globais
    $(document).bind('ajaxStart', function (event) {
        console.info(`Vai iniciar ajax ${event.type}`)
        // meter aqui um loading massa
    })

    $(document).bind('ajaxComplete', function (event, jqXHR, settings) {

        console.info(`Finalizado ajax ${event.type} >> ${decodeURI(settings.url)}`)
        // esconder o loading
    })

    // init app
    let simple = new Controller(Model, View)

}