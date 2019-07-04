class View {
    constructor(cardContainerId, cardCount) {
        console.info(`view construido`)

        this.cardContainer = $(cardContainerId)
        this.cards = []        

        //$.subscribe("model.initialShuffle", this.shuffle.bind(this))

        $.subscribe("view.clickCarta", this.clickCarta.bind(this)) // vai mudar para op controller
        //$.subscribe("view.notify", this.notify.bind(this))

        $.subscribe("controller.cardDrawnToMesaVirada", this.appendCard.bind(this))
        
        this.buttonBindregister(this)
    }

    buttonBindregister(self) {
        $('.stack').click(function () {
            self.stackAll();
        });

        $('.spread').click(function () {
            self.spreadAll();
        });

        $('.shuffle').click(function () {
            self.shuffle();
        });

        $('.flip').click(function () {
            self.toogleFlipAll();
        });

        $('.player').click(function () {
            self.player();
        });
    }

    geraCard(event, param) {
        console.info("generate card", param)
        return $("<li>").addClass("card").data("indice", param.idx)
            .attr("data-idx", param.idx)
            .attr("data-code", param.card.code)
            .attr("data-suit", param.card.suit)
            .attr("data-value", param.card.value)
            .attr("data-img-png", param.card.images.png)
            .attr("data-img-svg", param.card.images.svg)
            .append($("<div>").addClass("flip-card")
                .append($("<div>").addClass("flip-card-inner")
                    .append($("<div>").addClass("flip-card-front")
                        .append($("<img>").addClass("imgCarta")
                            .attr("src", "card-back-orange.png")
                            .attr("alt", `Fundo - ${param.card.value} of ${param.card.suit}`)))
                    .append($("<div>").addClass("flip-card-back")
                        .append($("<img>").addClass("imgCarta")
                            .attr("src", `${param.card.images.png}`)
                            .attr("alt", `Frente - ${param.card.value} of ${param.card.suit}`)))))
            .click(function (e) {
                $.publish('view.clickCarta', { event: e, target: $(this) })
            })
    }

    appendCard(event, params){
        let cardView = this.geraCard(null, params)
        this.cards.push(cardView)
        this.cardContainer.append(cardView)

        console.log('append', params)

        this.spread($(cardView), params.idx)
    }

    clickCarta(event, param) {
        //console.log('view.clickCarta', event, param)
       this.toggleFlip($(param.target))
    }

    stackAll() {
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                this.stack(o, e)
            }.bind(this), e * 150)
        }.bind(this))
    }

    stack(target, idx) {
        target.removeClass("ani" + idx)
        target.removeClass("p1")
        target.removeClass("p2")
    }

    spreadAll() {
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                this.spread(o, e);
            }.bind(this), e * 150)
        }.bind(this))
    }

    spread(target, idx) {
        target.removeClass("p1")
        target.removeClass("p2")
        target.addClass("ani" + idx)
    }

    player() {
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                o.removeClass("ani" + e)
                if (e % 2 == 0)
                    o.addClass("p1")
                else
                    o.addClass("p2")
            }, e * 150)
        })
    }

    shuffle() {
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                o.removeClass("ani" + e)
                o.removeClass("p1")
                o.removeClass("p2")
                var deck = ((Math.floor(Math.random() * 3) + 1).toFixed(0))
                o.addClass("deck" + deck)
                setTimeout(function () {
                    o.removeClass("deck" + deck)
                    //$.publish('view.shuffleDone', e)
                }, e * 100)
            }, e * 100)
        })
    }

    toogleFlipAll() {
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                this.toggleFlip(o)
            }.bind(this), e * 150)
        }.bind(this))
    }

    toggleFlip(target) {
            if (target.hasClass("flip-card-desvirada"))
                target.removeClass("flip-card-desvirada")
            else 
                target.addClass("flip-card-desvirada")
    }

    notify(e, model) {
        if(model.mesaVirada == null || model.mesaDesvirada == null) {
            this.shuffle()
        }
        else {
            console.dir(model)
            this.toggleFlip(model.mesaVirada)            
        }

        if(model.vez != null && model.vez.remaining == 1) {
            $(".lblP1").addClass("vez")
            $(".lblP2").removeClass("vez")
        }
        else if(model.vez != null) {
            $(".lblP2").addClass("vez")
            $(".lblP1").removeClass("vez")
        }        
         
        model.pilhaJogador1 = null;
        model.pilhaJogador2 = null;
    }

    showDeckId(id) {
        let str = $('<p>' + id + '</p>')
        $('#deckHere').html(str)
    }
}