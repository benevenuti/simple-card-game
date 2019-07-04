class Model {
    get DECK_COUNT() {
        return 2
    }

    get BASE_URL() {
        return "https://deckofcardsapi.com/api/"
    }

    //The value, one of A (for an ace), 2, 3, 4, 5, 6, 7, 8, 9, 0 (for a ten), J (jack), Q (queen), or K (king)
    get CARDS() {
        return ["A", "2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K"]
    }
    //The suit, one of S (Spades), D (Diamonds), C (Clubs), or H (Hearts).
    get SUITS() {
        return ["S", "D", "C", "H"]
    }

    get DECK_SELECTION() {
        return [
            // A
            this.CARDS[0] + this.SUITS[0],
            this.CARDS[0] + this.SUITS[1],
            //this.CARDS[0] + this.SUITS[2],
            //this.CARDS[0] + this.SUITS[3],

            // J
            //this.CARDS[10] + this.SUITS[0],
            //this.CARDS[10] + this.SUITS[1],
            //this.CARDS[10] + this.SUITS[2],
            this.CARDS[10] + this.SUITS[3],

            // Q
            //this.CARDS[11] + this.SUITS[0],
            //this.CARDS[11] + this.SUITS[1],
            this.CARDS[11] + this.SUITS[2],
            //this.CARDS[11] + this.SUITS[3],

            // K
            //this.CARDS[12] + this.SUITS[0],
            this.CARDS[12] + this.SUITS[1],
            //this.CARDS[12] + this.SUITS[2],
            //this.CARDS[12] + this.SUITS[3],
        ]
    }

    get TOTAL_CARD_COUNT() {
        return this.DECK_SELECTION.length * this.DECK_COUNT
    }

    get P1() {
        // 7S
        return this.CARDS[6] + this.SUITS[0]
    }
    get P2() {
        // 8S
        return this.CARDS[7] + this.SUITS[0]
    }

    get ACTIONS() {
        return {
            SHUFFLE_DECK: "deck/new/shuffle/",
            DRAW_DECK: `deck/${this.deckid}/draw/`,
            ADD_MESA_VIRADA:
                ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesavirada${i}/add/`
                }.bind(this)),
            DRAW_MESA_VIRADA:
                ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesavirada${i}/draw/`
                }.bind(this)),
            ADD_MESA_DESVIRADA:
                ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesadesvirada${i}/add/`
                }.bind(this)),
            DRAW_MESA_DESVIRADA:
                ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesadesvirada${i}/draw/`
                }.bind(this)),
            ADD_VEZ: `deck/${this.deckid}/pile/vez/add/`,
            DRAW_VEZ: `deck/${this.deckid}/pile/vez/draw/`,
            ADD_PILHA_P1: `deck/${this.deckid}/pile/p1/add/`,
            ADD_PILHA_P2: `deck/${this.deckid}/pile/p2/add/`,
            DRAW_PILHA_P1: `deck/${this.deckid}/pile/p1/draw/`,
            DRAW_PILHA_P2: `deck/${this.deckid}/pile/p2/draw/`,
            LIST_MESA_VIRADA:
                ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesavirada${i}/list/`
                }.bind(this)),
            LIST_MESA_DESVIRADA:
                ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(function (o, i) {
                    return `deck/${this.deckid}/pile/mesadesvirada${i}/list/`
                }.bind(this)),
            LIST_VEZ: `deck/${this.deckid}/pile/vez/list/`,
            LIST_PILHA_P1: `deck/${this.deckid}/pile/p1/list/`,
            LIST_PILHA_P2: `deck/${this.deckid}/pile/p2/list/`
        }
    }

    constructor(deckid = null) {
        console.info(`model construido`)

        this.deckid = deckid

        this.mesaVirada = null
        this.mesaDesvirada = null
        this.vez = null
        this.pilhaJogador1 = null
        this.pilhaJogador2 = null
    }

    // not working
    consumeDeckApi(action, paramsObj) {
        let myUrl = this.BASE_URL + action
        let ret = null

        let jx = $.ajax({
            url: myUrl,
            async: false,
            type: 'GET',
            data: paramsObj
        }).done(function (data, textStatus, jqXHR) {
            console.info('ajax done', data, textStatus)
            ret = { data, textStatus }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error('ajax fail', jqXHR, textStatus, errorThrown)
            ret = { data: null, textStatus }
        })

        return ret
    }

    shuffle() {
        let ret = this.consumeDeckApi(this.ACTIONS.SHUFFLE_DECK, { deck_count: this.DECK_COUNT, cards: this.DECK_SELECTION.join(",") })
        console.info('model.shuffle', ret)
        //this.deckid = ret.data.deck_id
        return ret
    }

    draw() {
        return this.consumeDeckApi(this.ACTIONS.DRAW_DECK, { count: 1 })
    }

    addToVez(card) {
        return this.consumeDeckApi(this.ACTIONS.ADD_VEZ, { cards: card })
    }

    drawFromVez(card) {
        return this.consumeDeckApi(this.ACTIONS.DRAW_VEZ, { cards: card })
    }

    addToP1(card) {
        return this.consumeDeckApi(this.ACTIONS.ADD_PILHA_P1, { cards: card })
    }

    addToP2(card) {
        return this.consumeDeckApi(this.ACTIONS.ADD_PILHA_P2, { cards: card })
    }

    addToMesaVirada(card) {
        return this.consumeDeckApi(this.ACTIONS.ADD_MESA_VIRADA[payload.indice], { cards: card })
    }

    addToMesaDesvirada(card) {
        return this.consumeDeckApi(this.ACTIONS.ADD_MESA_DESVIRADA[payload.indice], { cards: card })
    }

    listPlayer1Pile() {
        let ret = this.consumeDeckApi(this.ACTIONS.LIST_PILHA_P1, {})
        this.pilhaJogador1 = ret.data
        return ret
    }

    listPlayer2Pile() {
        let ret = this.consumeDeckApi(this.ACTIONS.LIST_PILHA_P2, {})
        this.pilhaJogador2 = ret.data
        return ret
    }

    listVezPile() {
        let ret = this.consumeDeckApi(this.ACTIONS.LIST_VEZ, {})
        this.vez = ret.data
        return ret
    }

    listMesaViradaPile() {
        let ret = this.consumeDeckApi(this.ACTIONS.LIST_MESA_VIRADA, {})
        this.mesaVirada = ret.data
        return ret
    }

    listMesaDesviradaPile() {
        let ret = this.consumeDeckApi(this.ACTIONS.LIST_MESA_DESVIRADA, {})
        this.mesaDesvirada = ret.data
        return ret
    }

}

