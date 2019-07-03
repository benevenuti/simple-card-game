class Controller {

    constructor(Model, View) {
        console.info(`controller construido`)

        this.Model = new Model;
        this.View = new View('#cardList', 10)
        this.inicializa()
    }

    inicializa() {
        console.info(` controller inicializado`)

        // inscricao no pubsub dos eventos do model
        $.subscribe('model.playEvent.ctrl', this.play.bind(this))

        // inscricao no pubsub dos eventos da view
        $.subscribe('view.qulquerEvento.ctrl', this.qualquerEvento.bind(this))
    }

    play(event, obj) {
        console.info(`chamou ctrl.play`)
    }

    qualquerEvento() {
        console.info(`chamou ctrl.qualquerEvento`)
    }
}

