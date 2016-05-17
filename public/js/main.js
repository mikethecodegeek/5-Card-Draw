'use strict';

var socket;

$(document).ready(init);

function init() {
    socket = io();

    var playerHand = [];
    var playerDrawHand = [];

    socket.on('newHand', function(cards) {
      playerHand = cards
    });


    $('.well').on('click', function() {
        playerDrawHand.push($(this).text());
        $(this).addClass('active');
    });

    socket.on('finishDealing', function(hand) {
        $('#c1').text(hand[0]);
        $('#c2').text(hand[1]);
        $('#c3').text(hand[2]);
        $('#c4').text(hand[3]);
        $('#c5').text(hand[4]);

        $('#draw').on('click', function() {

            sendDraw(playerDrawHand);

        });

       console.log('player Hand', playerHand);
    });


    socket.on('winner', function(winner) {
        var hand = Hand.solve(playerDrawHand);
        var descr = hand.descr;

        console.log(descr);
        console.log(winner[0]);

        if (winner[0].descr === descr) {
            console.log('You win')
        }
        else {
            console.log('You Lose')
        }
    });
}

function sendDraw(hand) {
    socket.emit('drawHand', hand);
}
