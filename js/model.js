class Model {

    get EVENTS() {
        return {
            HASSHUFFLE: "hasShuffle",
            HASDRAW: "hasDraw",
            HASADDTOVEZ: "hasAddToVez",
            HASDRAWFROMVEZ: "hasDrawFromVez",
            HASADDTOP1: "hasAddToP1",
            HASADDTOP2: "hasAddToP2",
            HASADDTOMESAVIRADA: "hasAddToMesaVirada",
            HASADDTOMESADESVIRADA: "hasAddToMesaDesvirada",
            UPDATE: "update"
        }
    }


    get ACTIONS() {
        return {
            SHUFFLE_DECK: "deck/new/shuffle/",
            DRAW_DECK: `deck/${this.deckid}/draw/`,
            ADD_MESA_VIRADA:
                ' '.repeat((this.DECK_SELECTION.length * 2) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesavirada${i}/add/`
                }.bind(this)),
            DRAW_MESA_VIRADA:
                ' '.repeat((this.DECK_SELECTION.length * 2) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesavirada${i}/draw/`
                }.bind(this)),
            ADD_MESA_DESVIRADA:
                ' '.repeat((this.DECK_SELECTION.length * 2) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesadesvirada${i}/add/`
                }.bind(this)),
            DRAW_MESA_DESVIRADA:
                ' '.repeat((this.DECK_SELECTION.length * 2) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesadesvirada${i}/draw/`
                }.bind(this)),
            ADD_VEZ: `deck/${this.deckid}/pile/vez/add/`,
            DRAW_VEZ: `deck/${this.deckid}/pile/vez/draw/`,
            ADD_PILHA_P1: `deck/${this.deckid}/pile/p1/add/`,
            ADD_PILHA_P2: `deck/${this.deckid}/pile/p2/add/`,
            DRAW_PILHA_P1: `deck/${this.deckid}/pile/p1/draw/`,
            DRAW_PILHA_P2: `deck/${this.deckid}/pile/p2/draw/`,
            LIST_MESA_VIRADA:
                ' '.repeat((this.DECK_SELECTION.length * 2) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesavirada${i}/list/`
                }.bind(this)),
            LIST_MESA_DESVIRADA:
                ' '.repeat((this.DECK_SELECTION.length * 2) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesadesvirada${i}/list/`
                }.bind(this)),
            LIST_VEZ: `deck/${this.deckid}/pile/vez/list/`,
            LIST_PILHA_P1: `deck/${this.deckid}/pile/p1/list/`,
            LIST_PILHA_P2: `deck/${this.deckid}/pile/p2/list/`
        }
    }

    get baseUrl() { return "https://deckofcardsapi.com/api/" }

    //The value, one of A (for an ace), 2, 3, 4, 5, 6, 7, 8, 9, 0 (for a ten), J (jack), Q (queen), or K (king);
    get CARDS() { return ["A", "2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K"] }
    //The suit, one of S (Spades), D (Diamonds), C (Clubs), or H (Hearts).
    get SUITS() { return ["S", "D", "C", "H"] }

    get DECK_SELECTION() {
        return [
            // A
            this.CARDS[0] + this.SUITS[0],
            /*this.CARDS[0] + this.SUITS[1],
            this.CARDS[0] + this.SUITS[2],
            this.CARDS[0] + this.SUITS[3],*/

            // J
            this.CARDS[10] + this.SUITS[0],
            /*this.CARDS[10] + this.SUITS[1],
            this.CARDS[10] + this.SUITS[2],
            this.CARDS[10] + this.SUITS[3],*/

            // Q
            this.CARDS[11] + this.SUITS[0],
            /*this.CARDS[11] + this.SUITS[1],
            this.CARDS[11] + this.SUITS[2],
            this.CARDS[11] + this.SUITS[3],*/

            // K
            this.CARDS[12] + this.SUITS[0],
            this.CARDS[12] + this.SUITS[1],
            /*this.CARDS[12] + this.SUITS[2],
            this.CARDS[12] + this.SUITS[3],*/
        ]
    }

    get TURN_CONTROLLER_CARD() {
        return this.CARDS[6] + this.SUITS[0]
    }

    constructor(deckid = null) {
        console.info(`model construido`)

        this.deckid = deckid;

        this.mesaVirada = null;
        this.mesaDesvirada = null;
        this.vez = null;
        this.pilhaJogador1 = null;
        this.pilhaJogador2 = null;


        $.subscribe("model.shuffle", this.shuffle.bind(this));
        $.subscribe("model.addToMesaDesvirada", this.addToMesaDesvirada.bind(this));
        $.subscribe("model.addToMesaVirada", this.addToMesaVirada.bind(this));
        $.subscribe("model.addToP1", this.addToP1.bind(this));
        $.subscribe("model.addToP2", this.addToP2.bind(this));
        $.subscribe("model.addToVez", this.addToVez.bind(this));
        $.subscribe("model.drawFromVez", this.drawFromVez.bind(this));
        $.subscribe("model.draw", this.draw.bind(this));
        $.subscribe("model.update", this.update.bind(this));


        //A Partial Deck:
        //https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD,AC,2C,KC,AH,2H,KH
        //If you want to use a partial deck, then you can pass the card codes you want to use using the cards parameter. Separate the card codes with commas, and each card code is a just a two character case-insensitive string:

        //The value, one of A (for an ace), 2, 3, 4, 5, 6, 7, 8, 9, 0 (for a ten), J (jack), Q (queen), or K (king);
        //The suit, one of S (Spades), D (Diamonds), C (Clubs), or H (Hearts).

        // teste do caceta
        /*this.consumeDeckApi(this.ACTIONS.SHUFFLE_DECK, { deck_count: 2, cards: this.DECK_SELECTION.join(",") })
            .done(function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish('model.initialShuffle', JSON.stringify(data))
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
                $.publish('model.initialShuffle', textStatus)
            })*/
    }

    update(e, obj) {
        Object.assign(this, obj);
        $.publish(`model.event.${this.EVENTS.UPDATE}`, { model: this })
    }

    shuffle(p, payload) {
        this.consumeDeckApi(this.ACTIONS.SHUFFLE_DECK, { deck_count: 2, cards: [this.TURN_CONTROLLER_CARD, ...this.DECK_SELECTION].join(",") })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                this.deckid = data.deck_id;
                $.publish(`model.event.${this.EVENTS.HASSHUFFLE}`, { model: this, payload })
                
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })
    }

    draw(p, payload) {
        this.consumeDeckApi(this.ACTIONS.DRAW_DECK, { count: 1 })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASDRAW}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })
    }

    addToVez(p, payload) {
        this.consumeDeckApi(this.ACTIONS.ADD_VEZ, { cards: payload.card })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASADDTOVEZ}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })

    }

    drawFromVez(p, payload) {
        this.consumeDeckApi(this.ACTIONS.DRAW_VEZ, { cards: payload.card })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASDRAWFROMVEZ}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })

    }

    addToP1(p, payload) {
        this.consumeDeckApi(this.ACTIONS.ADD_PILHA_P1, { cards: payload.card })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASADDTOP1}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })

    }

    addToP2(p, payload) {
        this.consumeDeckApi(this.ACTIONS.ADD_PILHA_P2, { cards: payload.card })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASADDTOP2}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })

    }

    addToMesaVirada(p, payload) {
        this.consumeDeckApi(this.ACTIONS.ADD_MESA_VIRADA[payload.idxmesavirada], { cards: payload.card })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASADDTOMESAVIRADA}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })
    }

    addToMesaDesvirada(p, payload) {
        this.consumeDeckApi(this.ACTIONS.ADD_MESA_DESVIRADA[payload.idxmesadesvirada], { cards: payload.card })
            .done((function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish(`model.event.${this.EVENTS.HASADDTOMESADESVIRADA}`, { model: this, payload })
            }).bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
            })
    }

    
    grabP1() {
        // TODO: LIST P1 PILE TO UPDATE MODEL
        $.publish(`model.event.${this.EVENTS.UPDATE}`, { model: this })
        
    }
    
    grabP2() {
        // TODO: LIST P2 PILE TO UPDATE MODEL
        $.publish(`model.event.${this.EVENTS.UPDATE}`, { model: this })
        
    }

    grabVez() {
        // TODO: LIST VEZ PILE TO UPDATE MODEL
        $.publish(`model.event.${this.EVENTS.UPDATE}`, { model: this })
    }
    
    grabMesavirada() {
        // TODO: LIST MESAVIRADA PILE TO UPDATE MODEL
        $.publish(`model.event.${this.EVENTS.UPDATE}`, { model: this })
    }
    
    grabMesaDesvirada() {
        // TODO: LIST MESADESVIRADA PILE TO UPDATE MODEL
        $.publish(`model.event.${this.EVENTS.UPDATE}`, { model: this })
    }


    consumeDeckApi(action, paramsObj) {
        let myUrl = this.baseUrl + action
        return $.ajax({
            url: myUrl,
            type: 'GET',
            data: paramsObj
        })
    }
}

