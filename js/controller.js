class Controller {

    constructor(Model, View) {
        console.info(`controller construido`)

        this.View = new View('#cardList', 10)
        this.Model = new Model;
        this.inicializa()
    }

    inicializa() {
        console.info(`controller inicializado`)
        $.subscribe('view.clickCarta', this.clickCarta.bind(this))
        this.embaralha()
    }

    embaralha() {
        console.log(this.Model.shuffle())
    }

    addToMesaVirada() {
        $.publish("model.addToMesaDesvirada", {publish: "model.initialShuffle"});
    }

    addToMesaVirada() {
        $.publish("model.addToMesaVirada", {publish: "model.initialShuffle"});
    }

    addToP1() {
        $.publish("model.addToP1", {publish: "model.initialShuffle"});
    }

    addToP2() {
        $.publish("model.addToP2", {publish: "model.initialShuffle"});
    }

    addToVez() {
        $.publish("model.addToVez", {publish: "model.initialShuffle"});
    }

    draw() {
        $.publish("model.draw", {publish: "model.initialShuffle"});
    }

    
    jogar() {

    }



    verificaDesvirada(event, obj) {
        console.info(`chamou model.event.${this.Model.EVENTS.HASADDTOMESADESVIRADA}`)
        let idxs = [];
        let desviradas = this.Model.mesaDesvirada.filter(
            (o, i) => { 
                idxs.push(i);
                return o.remaining > 0
            }
        );
        if(this.Model.mesaDesvirada != null && desviradas.length >= 2) {
            if(desviradas[0].cards[0].code == desviradas[1].cards[0].code) {
                if(this.Model.vez != null && this.Model.vez.remaining == 1) {
                    $.publish("model.addToP1", {indice: idxs[0]});
                    $.publish("model.addToP1", {indice: idxs[1]});
                }
                else {
                    $.publish("model.addToP2", {indice: idxs[0]});
                    $.publish("model.addToP2", {indice: idxs[1]});
                }
            }
            else {
                $.publish("model.addToMesaVirada", {indice: idxs[0]});
                $.publish("model.addToMesaVirada", {indice: idxs[1]});
            }

            if(this.Model.vez != null && this.Model.vez.remaining == 1)
                $.publish("model.drawFromVez", {cards: this.Model.TURN_CONTROLLER_CARD});
            else
                $.publish("model.addToVez", {cards: this.Model.TURN_CONTROLLER_CARD});
        }
    }

    update(event, obj) {
        console.info(`chamou model.event`)
        $.publish("view.notify", {obj})
    }

    clickCarta(e, payload) {
        console.info(`chamou view.clickCarta`)
        if(this.Model.mesaVirada != null && this.Model.mesaVirada[payload.target.data("indice")].remaining > 0) {
            if(this.Model.mesaDesvirada != null && this.Model.mesaDesvirada.filter(o => o.remaining > 0).length < 2) {
                $.publish("model.addToMesaDesvirada", {indice: payload.target.data("indice")});
                //TODO: busca mesa desvirada
            }
        }
    }
}

