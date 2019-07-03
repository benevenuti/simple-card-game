class Model {

    get ACTIONS() {
        return { SHUFFLE_DECK: "deck/new/shuffle/" }
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
            this.CARDS[0] + this.SUITS[1],
            this.CARDS[0] + this.SUITS[2],
            this.CARDS[0] + this.SUITS[3],
            // J
            this.CARDS[10] + this.SUITS[0],
            this.CARDS[10] + this.SUITS[1],
            this.CARDS[10] + this.SUITS[2],
            this.CARDS[10] + this.SUITS[3],
            // Q
            this.CARDS[11] + this.SUITS[0],
            this.CARDS[11] + this.SUITS[1],
            this.CARDS[11] + this.SUITS[2],
            this.CARDS[11] + this.SUITS[3],
            // K
            this.CARDS[12] + this.SUITS[0],
            this.CARDS[12] + this.SUITS[1],
            this.CARDS[12] + this.SUITS[2],
            this.CARDS[12] + this.SUITS[3],
        ]
    }

    constructor() {
        console.info(`model construido`)

        this.mesaVirada = null;
        this.mesaDesvirada = null;
        this.vez = null;
        this.pilhaJogador1 = null;
        this.pilhaJogador2 = null;


        //A Partial Deck:
        //https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD,AC,2C,KC,AH,2H,KH
        //If you want to use a partial deck, then you can pass the card codes you want to use using the cards parameter. Separate the card codes with commas, and each card code is a just a two character case-insensitive string:

        //The value, one of A (for an ace), 2, 3, 4, 5, 6, 7, 8, 9, 0 (for a ten), J (jack), Q (queen), or K (king);
        //The suit, one of S (Spades), D (Diamonds), C (Clubs), or H (Hearts).

        // teste do caceta
        this.consumeDeckApi(this.ACTIONS.SHUFFLE_DECK, { deck_count: 2, cards: this.DECK_SELECTION.join(",") })
            .done(function (data, textStatus, jqXHR) {
                console.info(data, textStatus)
                $.publish('model.initialShuffle', JSON.stringify(data))
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR, textStatus, errorThrown)
                $.publish('model.initialShuffle', textStatus)
            })
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

