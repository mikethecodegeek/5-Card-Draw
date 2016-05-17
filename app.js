'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var Hand = require('pokersolver').Hand;
var http = require('http');
var path = require('path');

var app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

var server = http.createServer(app);
var io = require('socket.io')(server);

var userCount = 0;
var selections = [];

io.on('connection', function(socket) {
    deck();
    var shuffledDeck = shuffleCards();
    var cards = [];
    for (var b = 0; b < 5; b++) {
        cards.push(dealCard(shuffledDeck));
    }
    socket.emit('newHand', cards)

    socket.emit('finishDealing', cards);

    userCount++;
    console.log('userCount:', userCount);

    if(userCount === 1 || userCount === 2) {
        io.emit('playerNum', userCount);
    }

    if(userCount === 2) {
        io.emit('gameStart', null);
    }


    socket.on('drawHand', hand => {
        //var amountOfCards = 5 - hand.length;
        var newHand = hand;
         while(newHand.length < 5) {
            newHand.push(shuffledDeck.pop());
          //  console.log(shuffledDeck);
        }
        //console.log('new Hand:',newHand)
        socket.emit('getDrawHand', newHand)
        socket.emit('finishDealing', newHand);

        selections.push(newHand);

        if(selections.length === 2) {
          console.log(selections);
            var results = {
              winner: determineWinner(selections),
              player1Hand: selections[0],
              player2Hand: selections[1]
            }
            io.emit('winner', results);
            selections = [];
        }
    });

    socket.on('disconnect', function() {
        userCount--;
        console.log('userCount:', userCount);
    });
});

function determineWinner(selections) {
    var hand1 = Hand.solve(selections[0]);
    var hand2 = Hand.solve(selections[1]);
    return Hand.winners([hand1, hand2]);
}

server.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});

function deck(){
    var names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    var suits = ['h','d','s','c'];
    var cards = [];
    var count = 1;
    var cardPic = '';
    for( var s = 0; s < suits.length; s++ ) {
        for( var n = 0; n < names.length; n++ ) {
            cards.push(names[n] + suits[s]);
            count++;
        }
    }

    return cards;
}

function shuffleCards() {
    var array = deck();
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function dealCard(deck) {
    return deck.pop();
}
