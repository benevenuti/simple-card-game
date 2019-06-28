function CardView(cardContainerId) {
    this.cardContainer = $(cardContainerId);
    this.cards = [];
}

CardView.prototype.geraCard = function() {
    console.log("generate card");
    return $("<li>").addClass("card")
        .append(
            $("<div>").addClass("flip-card")
                .append(
                    $("<div>").addClass("flip-card-inner")
                        .append(
                            $("<div>").addClass("flip-card-front")
                                .append($("<img>").addClass("imgCarta")
                                    .attr("src", "card-back-orange.png")
                                    .attr("alt", "Carta Fundo")
                                )
                        )
                        .append(
                            $("<div>").addClass("flip-card-back")
                                .append($("<img>").addClass("imgCarta")
                                    .attr("src", "")
                                    .attr("alt", "Carta Frente")
                                )
                        )
                )
        )
}

CardView.prototype.init = function(qtd) {
    console.log("init");
    ' '.repeat(qtd-1).split(' ').forEach(function(o){
        this.cards.push(this.geraCard());
    }.bind(this));

    console.log("cards.length: "+this.cards.length);
    this.cardContainer.append(this.cards);
}

CardView.prototype.stack = function() {
    this.cards.forEach(function(o, e) {
        setTimeout(function() {
          o.removeClass("ani" + e);
        }, e * 150)        
    });
}

CardView.prototype.spread = function() {
    this.cards.forEach(function(o, e) {
        setTimeout(function() {
          o.addClass("ani" + e);
        }, e * 150)        
    });
}

CardView.prototype.shuffle = function() {
    this.cards.forEach(function(o, e) {
        setTimeout(function() {
            o.removeClass("ani" + e);
            var deck = ((Math.floor(Math.random() * 3)+1).toFixed(0));
            o.addClass("deck" +  deck);
            setTimeout(function() {
                o.removeClass("deck"+deck);    
            }, e * 100);
        }, e * 100);
    });
}

CardView.prototype.toogleFlipAll = function() {
    this.cards.forEach(function(o, e) {
        setTimeout(function() {
          if(o.hasClass("flip-card-desvirada"))
            o.removeClass("flip-card-desvirada");
          else
            o.addClass("flip-card-desvirada");
        }, e * 150)        
    });
}



CardView.prototype.notify = function(model) {
    
}