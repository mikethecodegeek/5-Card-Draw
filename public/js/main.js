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
        playerDrawHand.push(card);
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

        $('#send').on('click', function () {
            sendHand(playerHand);
        });

        $('#draw').on('click', function() {
            sendDraw(playerDrawHand);
        });

        console.log('player Hand', playerHand);
    });

    socket.on('finishDraw', function() {
        $('#c1').text(playerDrawHand[0]).removeClass('active');
        $('#c2').text(playerDrawHand[1]).removeClass('active');
        $('#c3').text(playerDrawHand[2]).removeClass('active');
        $('#c4').text(playerDrawHand[3]).removeClass('active');
        $('#c5').text(playerDrawHand[4]).removeClass('active');
    });

    socket.on('winner', function(winner) {
        var hand = Hand.solve(playerHand);
        var descr = hand.descr;

        console.log(winner);
        
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