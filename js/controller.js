class Controller {

    constructor(Model, View) {
        console.info(`controller construido`)

        this.View = new View('#cardList', 10)
        this.Model = new Model;
        this.inicializa()
    }

    inicializa() {
        console.info(`controller inicializado`)
        $.subscribe('view.clickCarta', this.clickCarta.bind(this) )
        $.subscribe('view.spreadDone', this.playerInfo.bind(this) )
        this.embaralha()
    }

    playerInfo(event, param){
        $.publish('controller.trocouVez', this.Model.vez)
    }

    async embaralha() {
        this.Model.TOTAL_CARD_COUNT

        // solicita novo deck para o model
        let ret = await this.Model.shuffle()

        for (let idx = 0; idx < ret.remaining; idx++) {
            // pega carta do novo deck 
            let drawn = await this.Model.draw()
            let card = drawn.cards[0]
            //remaining = drawn.data.remaining
            // adiciona a carta para a pilha de cartas viradas
            this.Model.addToMesaVirada(idx, card.code)
            // publica o evento da carta, quem ouve é a view
            $.publish('controller.cardDrawnToMesaVirada', { idx: idx, card: card })
        }

        $.publish('controller.allCardsDrawn', {})
    }

    //setTimeout(() => $.publish('controller.trocouVez', 'P1'), 9 * 150)

    verificaDesvirada() {

        // remove das desviradas
        let card1 = this.Model.drawFromMesaDesvirada()
        let card0 = this.Model.drawFromMesaDesvirada()

        //console.log(`card0`, card0)
        //console.log(`card1`, card1)

        //sendo iguais, move para a pilha do player ativo
        if (card0.card == card1.card) {

            // se P1
            if (this.Model.vez == this.Model.P1) {
                this.Model.addToP1(card1)
                $.publish('controller.addToP1', { idx: card1.idx, target: card1.target })
                this.Model.addToP1(card0)
                $.publish('controller.addToP1', { idx: card0.idx, target: card0.target })
                // se P2
            } else {
                this.Model.addToP2(card1)
                $.publish('controller.addToP2', { idx: card1.idx, target: card1.target })
                this.Model.addToP2(card0)
                $.publish('controller.addToP2', { idx: card0.idx, target: card0.target })
            }
            //sendo diferentes
        } else {
            this.Model.addToMesaVirada(card0.idx, card0.card)
            $.publish('controller.toggleUnflip', card0.target)
            this.Model.addToMesaVirada(card1.idx, card1.card)
            $.publish('controller.toggleUnflip', card1.target)
        }

        if (this.jogoDeveContinuar()) {
            this.trocaVez()
        } else {
            $.publish('controller.endGame', this.calculaVencedor())            
        }

    }

    jogoDeveContinuar() {
        let p1 = this.Model.pilhaJogador1.length
        let p2 = this.Model.pilhaJogador2.length
        return ((p1 + p2) < this.Model.TOTAL_CARD_COUNT)
    }

    calculaVencedor() {
        let winner = null
        let p1 = this.Model.pilhaJogador1.length
        let p2 = this.Model.pilhaJogador2.length
        if (p1 > p2) {
            winner = this.Model.P1
        } else if (p1 < p2) {
            winner = this.Model.P2
        } else {
            winner = "TIE"
        }
        return {winner : winner, "P1Points" : p1, "P2Points" : p2}
    }

    trocaVez() {
        if (this.Model.vez == this.Model.P1) {
            this.Model.vez = this.Model.P2
        } else {
            this.Model.vez = this.Model.P1
        }

        $.publish('controller.trocouVez', this.Model.vez)
    }

    async clickCarta(e, payload) {
        let idx = $(payload.target[0]).data("idx")

        if (this.Model.mesaVirada[idx] != null) {
            if (this.Model.mesaDesvirada.length < 2) {
                let card = this.Model.drawFromMesaVirada(idx)
                this.Model.addToMesaDesvirada({ idx: idx, card: card, target: payload.target[0]})
                $.publish('controller.toggleFlip', $(payload.target[0]))
            }

            if (this.Model.mesaDesvirada.length == 2) {
                setTimeout(function () {
                    this.verificaDesvirada()
                }.bind(this), 2000 )
            }
        } else {
            console.warn(`o idx ${idx} já foi virado`)
        }
    }
}

