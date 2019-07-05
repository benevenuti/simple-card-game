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
        return "P1"
    }
    get P2() {
        return "P2"
    }

    get ACTIONS() {
        return {
            SHUFFLE_DECK: "deck/new/shuffle/",
            DRAW_DECK: `deck/${this.deckid}/draw/`
        }
    }

    constructor(deckid = null) {
        console.info(`model construido`)

        this.deckid = deckid

        this.mesaVirada = []
        this.mesaDesvirada = []
        this.vez = this.P1
        this.pilhaJogador1 = []
        this.pilhaJogador2 = []
    }

    async consumeDeckApi(action, paramsObj) {
        let myUrl = this.BASE_URL + action
        let ret = null

        try {
            //ret = await $.get({
            ret = await $.ajax({
                url: myUrl,
                type: 'GET',
                data: paramsObj
            })
        } catch (e) {
            console.error(e)
        }
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

    addToP1(obj) {
        this.pilhaJogador1.push(obj)
    }

    addToP2(obj) {
        this.pilhaJogador2.push(obj)
    }

    addToMesaVirada(idx, card) {
        this.mesaVirada[idx] = card
    }

    drawFromMesaVirada(idx) {
        let card = this.mesaVirada[idx]
        this.mesaVirada[idx] = null
        return card
    }

    addToMesaDesvirada(obj) {
        this.mesaDesvirada.push(obj)
    }

    drawFromMesaDesvirada() {
        let card = this.mesaDesvirada.pop()
        return card
    }

}

