'use strict';

var socket;

$(document).ready(init);

function init() {
    socket = io();

    var playerHand = [];
    var playerDrawHand = [];

    socket.on('card', function(card) {
        if (playerHand.length < 5) {
            playerHand.push(card);
        }
    });

    socket.on('newCard', function(card) {
        playerHand.push(card);
    });

    $('.well').on('click', function() {
        playerDrawHand.push($(this).text());
        $(this).addClass('active');
    });

    socket.on('finishDealing', function() {
        $('#c1').text(playerHand[0]);
        $('#c2').text(playerHand[1]);
        $('#c3').text(playerHand[2]);
        $('#c4').text(playerHand[3]);
        $('#c5').text(playerHand[4]);

        $('#draw').on('click', function() {
            for (var a = 5; a< playerHand.length; a++) {
                playerDrawHand.push(playerHand[a]);
            }
            sendDraw(playerDrawHand);
            sendHand(playerDrawHand);
        });

      //  console.log('player Hand', playerHand);
    });

    socket.on('finishDraw', function() {
        $('#c1').text(playerHand[5]).removeClass('active');
        $('#c2').text(playerHand[6]).removeClass('active');
        $('#c3').text(playerHand[7]).removeClass('active');
        $('#c4').text(playerHand[8]).removeClass('active');
        $('#c5').text(playerHand[9]).removeClass('active');
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

function sendHand(hand){
    socket.emit('sendHand', hand)
}

function sendDraw(hand) {
    socket.emit('drawHand', hand);
}