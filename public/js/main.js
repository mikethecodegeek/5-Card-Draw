'use strict';

var socket;

$(document).ready(init);

function init() {
    socket = io();

    var playerHand = [];
    var playerDrawHand = [];

    socket.on('newHand', function(cards) {
      playerHand = cards
      var hand = Hand.solve(playerHand);
      var descr = hand.descr;
      $('#winner').text(descr);
    });

    socket.on('getDrawHand', function(hand) {
      playerDrawHand = hand;
      var hand = Hand.solve(playerDrawHand);
      var descr = hand.descr;
      $('#winner').text(descr);

    })


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

    //   console.log('player Hand', playerHand);
    });


    socket.on('winner', function(winner) {
        var hand = Hand.solve(playerDrawHand);
        var descr = hand.descr;
        console.log(playerDrawHand)

        console.log(descr);
        console.log(winner);
        if (winner.player1Hand[0] == playerDrawHand[0]) {
          var oppHand = winner.player2Hand;
        }
        else {
          var oppHand = winner.player1Hand;
        }
        console.log(oppHand);
        $('#opScore').text(Hand.solve(oppHand).descr);
        $('#o1').text(oppHand[0]);
        $('#o2').text(oppHand[1]);
        $('#o3').text(oppHand[2]);
        $('#o4').text(oppHand[3]);
        $('#o5').text(oppHand[4]);

        if (winner.winner[0].descr === descr) {
            $('#winner').text('You win ' + descr)
        }
        else {
            $('#winner').text('You Lose ' + descr)
        }
    });
}

function sendDraw(hand) {
    socket.emit('drawHand', hand);
}
