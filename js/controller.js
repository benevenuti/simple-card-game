class Controller {

    constructor(Model, View) {
        console.info(`controller construido`)

        this.View = new View('#cardList', 10)
        this.Model = new Model;
        this.inicializa()
    }

    inicializa() {
        console.info(` controller inicializado`)

        // inscricao no pubsub dos eventos do model
        $.subscribe('model.playEvent.ctrl', this.play.bind(this))
        $.subscribe('model.event', this.modelEvent.bind(this))

        // inscricao no pubsub dos eventos da view
        $.subscribe('view.qulquerEvento.ctrl', this.qualquerEvento.bind(this))

        this.embaralha()
    }

    embaralha() {
        $.publish('controller.shuffle', {publish: "model.initialShuffle"})
    }

    addToMesaVirada() {
        $.publish("controller.addToMesaDesvirada", {publish: "model.initialShuffle"});
    }

    addToMesaVirada() {
        $.publish("controller.addToMesaVirada", this.addToMesaVirada.bind(this));
    }

    addToP1() {
        $.publish("controller.addToP1", this.addToP1.bind(this));
    }

    addToP2() {
        $.publish("controller.addToP2", this.addToP2.bind(this));
    }

    addToVez() {
        $.publish("controller.addToVez", this.addToVez.bind(this));
    }

    draw() {
        $.publish("controller.draw", this.draw.bind(this));
    }

    
    jogar() {

    }



    play(event, obj) {
        console.info(`chamou ctrl.play`)
    }

    modelEvent(event, obj) {
        console.info(`chamou model event`)
    }

    qualquerEvento() {
        console.info(`chamou ctrl.qualquerEvento`)
    }
}

