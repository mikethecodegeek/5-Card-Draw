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
        playerDrawHand.push($(this).attr('data'));
        $(this).addClass('active');
    });

    socket.on('finishDealing', function(hand) {
      var loc='./ccards/';
      //console.log(loc+hand[0].toUpperCase()+'.png')
        $('#c1').attr('data',(hand[0]))
        $('#card1').attr("src",loc+hand[0].toUpperCase()+'.png');
        $('#c2').attr('data',(hand[1]));
        $('#card2').attr("src",loc+hand[1].toUpperCase()+'.png');
        $('#c3').attr('data',(hand[2]));
        $('#card3').attr("src",loc+hand[2].toUpperCase()+'.png');
        $('#c4').attr('data',(hand[3]));
        $('#card4').attr("src",loc+hand[3].toUpperCase()+'.png');
        $('#c5').attr('data',(hand[4]));
        $('#card5').attr("src",loc+hand[4].toUpperCase()+'.png');

        $('#draw').on('click', function() {

            sendDraw(playerDrawHand);
            $('.well').removeClass('active');

        });

    });


    socket.on('winner', function(winner) {
        var hand = Hand.solve(playerDrawHand);
        var descr = hand.descr;

        if (winner.player1Hand[0] == playerDrawHand[0]) {
          var oppHand = winner.player2Hand;
        }
        else {
          var oppHand = winner.player1Hand;
        }
        var loc='./ccards/';
        $('#opScore').text(Hand.solve(oppHand).descr);
        $('#o1').attr('data',(oppHand[0]))
        $('#opcard1').attr("src",loc+oppHand[0].toUpperCase()+'.png');;
        $('#o2').attr('data',(oppHand[1]))
        $('#opcard2').attr("src",loc+oppHand[1].toUpperCase()+'.png');;
        $('#o3').attr('data',(oppHand[2]))
        $('#opcard3').attr("src",loc+oppHand[2].toUpperCase()+'.png');;
        $('#o4').attr('data',(oppHand[3]))
        $('#opcard4').attr("src",loc+oppHand[3].toUpperCase()+'.png');;
        $('#o5').attr('data',(oppHand[4]))
        $('#opcard5').attr("src",loc+oppHand[4].toUpperCase()+'.png');;

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
