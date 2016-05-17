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

    io.emit('shuffledDeck', shuffledDeck);

    userCount++;
    console.log('userCount:', userCount);

    if(userCount === 1 || userCount === 2) {
        io.emit('playerNum', userCount);
    }

    if(userCount === 2) {
        io.emit('gameStart', null);
    }


    socket.on('sendHand', hand => {
        console.log('player hand:', hand);
        selections.push(hand);

        if(selections.length === 2) {
            var winner = determineWinner(selections);
            io.emit('winner', winner);
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