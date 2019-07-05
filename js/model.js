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

        //inicializando mesavirada e desvirada
        this.mesaVirada = ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(o => null)
        this.mesaDesvirada = ' '.repeat((this.TOTAL_CARD_COUNT) - 1).split(' ').map(o => null)

        this.vez = null
        this.pilhaJogador1 = null
        this.pilhaJogador2 = null
    }

    async consumeDeckApi(action, paramsObj) {
        let myUrl = this.BASE_URL + action
        let ret = null

        try {
            ret = await $.ajax({
                url: myUrl,
                //async: false,
                type: 'GET',
                data: paramsObj
            })
        } catch (e) {
            console.error(e)
        }
        
        /*.done(function (data, textStatus, jqXHR) {
            console.info('ajax done', data, textStatus, jqXHR)
            ret = { data: data, textStatus: textStatus }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error('ajax fail', jqXHR, textStatus, errorThrown)
            ret = { data: null, textStatus: textStatus }
        })*/

        return ret
    }

    async generateDeck() {
        return await this.consumeDeckApi(this.ACTIONS.SHUFFLE_DECK, { deck_count: this.DECK_COUNT, cards: this.DECK_SELECTION.join(",") })        
    }

    async shuffle() {
        let ret = await this.generateDeck()
        this.deckid = ret.deck_id
        return ret
    }

    async draw() {
        return await this.consumeDeckApi(this.ACTIONS.DRAW_DECK, { count: 1 })
    }

    async addToVez(card) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_VEZ, { cards: card })
    }

    async drawFromVez(card) {
        return await this.consumeDeckApi(this.ACTIONS.DRAW_VEZ, { cards: card })
    }

    async addToP1(card) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_PILHA_P1, { cards: card })
    }

    async addToP2(card) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_PILHA_P2, { cards: card })
    }

    async addToMesaVirada(idx, card) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_MESA_VIRADA[idx], { cards: card })
    }

    async drawFromMesaVirada(idx) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_MESA_VIRADA[idx], {})
    }

    async addToMesaDesvirada(idx, card) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_MESA_DESVIRADA[idx], { cards: card })
    }

    async drawFromMesaDesvirada(idx) {
        return await this.consumeDeckApi(this.ACTIONS.ADD_MESA_VIRADA[idx], {})
    }

    async _listPlayer1Pile() {
        return await this.consumeDeckApi(this.ACTIONS.LIST_PILHA_P1, {})
    }

    async listPlayer1Pile() {
        let ret = await _listPlayer1Pile()
        this.pilhaJogador1 = ret.data
        return ret
    }

    async _listPlayer2Pile() {
        return await this.consumeDeckApi(this.ACTIONS.LIST_PILHA_P2, {})
    }

    async listPlayer2Pile() {
        let ret = await _listPlayer2Pile()
        this.pilhaJogador1 = ret.data
        return ret
    }

    async _listMesaViradaPile() {
        return await this.consumeDeckApi(this.ACTIONS.LIST_MESA_VIRADA, {})
    }

    async listMesaViradaPile() {
        let ret = await this._listMesaViradaPile()
        this.mesaVirada = ret.data
        return ret
    }

    async _listMesaDesviradaPile() {
       return await this.consumeDeckApi(this.ACTIONS.LIST_MESA_DESVIRADA, {})
    }

    async listMesaDesviradaPile() {
        let ret = await this._listMesaDesviradaPile()
        this.mesaDesvirada = ret.data
        return ret
    }

}

