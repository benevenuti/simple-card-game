
function iniciarSimpleCardGame() {
    
    console.info(`chamou o main`)

    // registra os eventos globais
    $(document).bind('ajaxStart', function (event) {
        //console.info(`${event.type}`)
        $('.container-loading.blocker-box').show()
    })

    $(document).bind('ajaxComplete', function (event, jqXHR, settings) {
        console.info(`${event.type} >> ${decodeURI(settings.url)}`)
        $('.container-loading.blocker-box').hide()
    })

    // init app
    let simple = new Controller(Model, View)

}