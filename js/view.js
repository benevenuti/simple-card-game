class View {
    constructor(cardContainerId, cardCount) {
        console.info(`view construido`)

        this.cardContainer = $(cardContainerId)
        this.cards = []        

        //$.subscribe("model.initialShuffle", this.shuffle.bind(this))

        //$.subscribe("view.clickCarta", this.clickCarta.bind(this)) // vai mudar para op controller
        $.subscribe("view.notify", this.notify.bind(this))

        this.init(cardCount)
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

    geraCard(indice) {
        console.info("generate card")
        return $("<li>").addClass("card").data("indice", indice)
            .attr("data-indice", indice)
            .append($("<div>").addClass("flip-card")
                .append($("<div>").addClass("flip-card-inner")
                    .append($("<div>").addClass("flip-card-front")
                        .append($("<img>").addClass("imgCarta")

                            .attr("src", "_card-back-orange.png")
                            .attr("alt", "Carta Fundo")))
                    .append($("<div>").addClass("flip-card-back")
                        .append($("<img>").addClass("imgCarta")

                            .attr("src", "_https://deckofcardsapi.com/static/img/AS.png")
                            .attr("alt", "Carta Frente")))))
            .click(function (e) {
                $.publish('view.clickCarta', { event: e, target: $(this) })
            })
    }

    clickCarta(event, param) {
        //console.log('view.clickCarta', event, param)
        //this.toggleFlip($(param.target))
    }

    init(qtd) {
        console.info("init")
        ' '.repeat(qtd - 1).split(' ').forEach(function (o, i) {
            this.cards.push(this.geraCard(i))
        }.bind(this))
        console.info("cards.length: " + this.cards.length)
        this.cardContainer.append(this.cards)
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

    playerAll() {
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                if (e % 2 == 0)
                    this.player1()
                else
                    this.player2()
            }.bind(this), e * 150)
        }.bind(this))
    }

    player1(target, idx) {
        o.removeClass("ani" + e)
        o.addClass("p1")
    }

    player2(target, idx) {
        o.removeClass("ani" + e)
        o.addClass("p1")
    }

    cardImage(target, src) {
        target.attr("src",src);
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

    flip(target) {
        target.addClass("flip-card-desvirada")
    }

    unflip(target) {
        target.removeClass("flip-card-desvirada")
    }

    toggleFlip(target) {
            if (target.hasClass("flip-card-desvirada"))
                this.flip(target)
            else 
                this.unflip(target)
    }

    /*notify(e, model) {
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
    }*/

    showDeckId(id) {
        let str = $('<p>' + id + '</p>')
        $('#deckHere').html(str)
    }
}