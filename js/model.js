class Model {

    ACTIONS = {
        SHUFFLE_DECK: "deck/new/shuffle/"
    }

    baseUrl = "https://deckofcardsapi.com/api/"    

    constructor() {
        console.info(`model construido`)

        this.mesaVirada = null;
        this.mesaDesvirada = null;
        this.vez = null;
        this.pilhaJogador1 = null;
        this.pilhaJogador2 = null;


        // teste do caceta
        this.consumeDeckApi(this.ACTIONS.SHUFFLE_DECK, { deck_count: 4 })
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
        console.info(myUrl)
        return $.ajax({
            url: myUrl,
            type: 'GET',
            data: paramsObj
        })
    }
}

