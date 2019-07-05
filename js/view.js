class View {
    constructor(cardContainerId, cardCount) {
        console.info(`view construido`)

        this.cardContainer = $(cardContainerId)
        this.cards = []

        $.subscribe("controller.cardDrawnToMesaVirada", this.appendCard.bind(this))
        $.subscribe("controller.allCardsDrawn", this.shuffle.bind(this))
        $.subscribe("view.shuffleDone", this.spreadAll.bind(this))

        $.subscribe('controller.toggleFlip', this.flipCard.bind(this))
        $.subscribe('controller.toggleUnflip', this.unflipCard.bind(this))

        $.subscribe('controller.addToP1', this.player1.bind(this))
        $.subscribe('controller.addToP2', this.player2.bind(this))

        $.subscribe('controller.trocouVez', this.trocouVez.bind(this))

        $.subscribe('controller.endGame', this.endGame.bind(this))

    }

    trocouVez(event, playerId){        
        $('.lblPlayer').removeClass('activePlayer')
        $(`.lbl${playerId}`).addClass('activePlayer')
        
        //$('.container-loading.blocker-box').show()
        $('.messages').html(`Vez do ${playerId == 'P1' ? 'Player 1' : 'Player 2'}`)
            //$('.container-loading.blocker-box').hide()
        //$('.loading-image').hide()
    }

    endGame(event, winnerInfo){
        console.info(winnerInfo)
        $('.lblPlayer').removeClass('activePlayer')
        
        $('.container-loading.blocker-box').show()

        let msg = `Pontos Player 1 : ${winnerInfo.P1Points}<br>`
        msg += `Pontos Player 2 : ${winnerInfo.P2Points}<br>`
        msg += `${winnerInfo.winner == 'TIE' ? 'EMPATE' : 'VENCEDOR: ' + (winnerInfo.winner == 'P1' ? 'Player 1' : 'Player 2') }`

        $('.loading-label').html(msg).off('click').click(function () {
            document.location.reload()
        })
    }    

    geraCard(event, param) {
        //console.info("generate card", param)
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
                        /*.append($("<img>").addClass("imgCarta")
                            .attr("src", "card-back-orange.png")
                            .attr("alt", `Fundo - ${param.card.value} of ${param.card.suit}`))*/
                        )
                    .append($("<div>").addClass("flip-card-back")
                        .append($("<img>").addClass("imgCarta")
                            .attr("src", `${param.card.images.png}`)
                            .attr("alt", `Frente - ${param.card.value} of ${param.card.suit}`)))))
            .click(function (e) {
                $.publish('view.clickCarta', { event: e, target: $(this) })
            })
    }

    appendCard(event, params) {
        let cardView = this.geraCard(null, params)
        this.cards.push(cardView)
        this.cardContainer.append(cardView)
        this.stack($(cardView), params.idx)
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

    spreadAll(event, idx) {
        //console.info('spreadAll', idx)
        if (idx == 9) {
            this.cards.forEach(function (o, e) {
                setTimeout(function () {
                    this.spread(o, e);
                }.bind(this), e * 150)
            }.bind(this))
            setTimeout(() => $.publish('view.spreadDone'), 9 * 150)
        }
    }

    spread(target, idx) {
        target.removeClass("p1")
        target.removeClass("p2")
        target.addClass("ani" + idx)
    }

    player1(e, params) {
        $('.messages').html(`Aizá player 1`)
        let t = $(params.target)
        t.removeClass("ani" + params.idx)
        t.addClass("p1")
    }

    player2(e, params) {
        let t = $(params.target)
        t.removeClass("ani" + params.idx)
        t.addClass("p2")
    }

    shuffle() {
        console.info('view.shuffle')
        this.cards.forEach(function (o, e) {
            setTimeout(function () {
                o.removeClass("ani" + e)
                o.removeClass("p1")
                o.removeClass("p2")
                var deck = ((Math.floor(Math.random() * 3) + 1).toFixed(0))
                o.addClass("deck" + deck)
                setTimeout(function () {
                    o.removeClass("deck" + deck)
                    $.publish('view.shuffleDone', e)
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

    flipCard(e, target){
        this.flip($(target))
    }

    unflipCard(e, target){
        this.unflip($(target))
    }

    flip(target) {
        $('.messages').html(``)
        target.addClass("flip-card-desvirada")
    }

    unflip(target) {
        $('.messages').html(`Patz, são diferentes !!!`)
        target.removeClass("flip-card-desvirada")
    }

    toggleFlip(target) {
            if (target.hasClass("flip-card-desvirada"))
                this.unflip(target)
            else
                this.flip(target) 
                
    }

    showDeckId(id) {
        let str = $('<p>' + id + '</p>')
        $('#deckHere').html(str)
    }
}