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
        this.Model.TOTAL_CARD_COUNT

        let ret = this.Model.shuffle()

        let remaining = ret.data.remaining

        while (remaining > 0) {
            let drawn = this.Model.draw()
            let card = drawn.data.cards[0]
            remaining = drawn.data.remaining
            this.Model.addToMesaVirada(card.code)
            $.publish('controller.')
            //this.View.geraCard(card)
        }
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
                } else {
                    $.publish("model.addToP2", {indice: idxs[0]});
                    $.publish("model.addToP2", {indice: idxs[1]});
                }
            } else {
                let carta = this.Model.drawFromMesaDesvirada(idxs[0])                
                this.Model.addToMesaVirada(carta)
                carta = this.Model.drawFromMesaDesvirada(idxs[1])                
                this.Model.addToMesaVirada(carta)
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
        console.dir(payload)
        if(this.Model.mesaVirada != null && this.Model.mesaVirada[payload.target.data("indice")].remaining > 0) {
            if(this.Model.mesaDesvirada != null && this.Model.mesaDesvirada.filter(o => o.remaining > 0).length < 2) {
                let carta = this.Model.drawFromMesaVirada(payload.target.data("indice"))                
                this.Model.addToMesaDesvirada(carta)
                //TODO: busca mesa desvirada
            }
        }
    }
}

