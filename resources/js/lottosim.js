//
// © 2018 lottosim.website
//

// FUNCTIONS
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function printArray(array, desc) {
  str = desc + ": ";
  // array.sort();
  array.sort((a, b) => (a - b)); // https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly#1063027
  for (j = 0; j < array.length; j++) {
    str += array[j] + " ";
  }
  return str;
}
// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript#2901298
function numberWithCommas(x) {
  // if (x.length <= 3) {
  //   return x;
  // } else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }
}

//WALLET OBJECT
var wallet = {
  //LAST TICKET
  myNumbers: [],
  roll: [],
  matches: [],
  hits: 0,
  net: 0,
  //LAST PURCHASE
  lastNgames: 0,
  lastNnetWon: 0,
  //TOTALS
  games: 0,
  gameMatches: [0, 0, 0, 0, 0, 0, 0],
  amtSpent: 0,
  amtWon: 0,
  netWon: 0,
  buyTicket: function(plays) {
    var results = lottoSim.play(plays);
    var temp = [];
    //LAST TICKET
    this.myNumbers = results[0];
    this.roll = results[1];
    this.matches = results[2];
    this.hits = results[3];
    this.net = results[4];
    //LAST PURCHASE
    this.lastNgames = results[5];
    this.lastNnetWon = results[9];
    //TOTALS
    this.games += results[5];
    temp = results[6];
    for (n = 0; n <= temp.length; n++) {
      this.gameMatches[n] += temp[n];
    }
    this.amtSpent += results[7];
    this.amtWon += results[8];
    this.netWon += results[9];
  },
  startOver: function() {
    this.myNumbers = "";
    this.roll = "";
    this.matches = "";
    this.hits = 0;
    this.net = 0;
    this.games = 0;
    this.gameMatches = [0, 0, 0, 0, 0, 0, 0];
    this.amtSpent = 0;
    this.amtWon = 0;
    this.netWon = 0;
    $("#thisPlay").empty();
    $("#thisPlay").append("<p>Click a button to play.</p>");
    $("#allPlays").empty();
    $("#allPlays").append("<p>Click a button to play.</p>");
  },
  printLastPlay: function() {
    // Empty previous results
    $("#thisPlay").empty();
    // Report current results
    // http://api.jquery.com/append/
    if (this.lastNgames === 1) {
      $("#thisPlay").append("<p>" + printArray(this.myNumbers, "My numbers") + "</p>");
      $("#thisPlay").append("<p>" + printArray(this.roll, "Lotto numbers") + "</p>");
      $("#thisPlay").append("<p>" + printArray(this.matches, "Matched numbers") + "</p>");
      $("#thisPlay").append("<p>You matched " + this.hits + " number(s).</p>");
      if (this.net > 0) {
        $("#thisPlay").append("<h3 style=\"color:green;\"><strong>You won $" + numberWithCommas(this.net) + ".</strong></h3>");
      } else if (this.net == 0) {
        $("#thisPlay").append("<h3 style=\"color:green;\"><strong>You broke even.</strong></h3>");
      } else {
        $("#thisPlay").append("<h3 style=\"color:darkred;\"><strong>You lost $" + numberWithCommas(Math.abs(this.net)) + "!</strong></h3>");
      }
    } else {
      $("#thisPlay").append("<p>You played the lottery " + numberWithCommas(this.lastNgames) + " times.</p>");
      if (this.lastNnetWon > 0) {
        $("#thisPlay").append("<h3 style=\"color:green;\"><strong>You won $" + numberWithCommas(this.lastNnetWon) + ".</strong></h3>");
      } else if (this.lastNnetWon == 0) {
        $("#thisPlay").append("<h3 style=\"color:green;\"><strong>You broke even.</strong></h3>");
      } else {
        $("#thisPlay").append("<h3 style=\"color:darkred;\"><strong>You lost $" + numberWithCommas(Math.abs(this.lastNnetWon)) + "!</strong></h3>");
      }
    }
  },
  printTotals: function() {
    // Empty previous results
    $("#allPlays").empty();
    // Report current results
    // http://api.jquery.com/append/
    $("#allPlays").append("<p>Total games played: " + numberWithCommas(this.games) + "</p>");
    // $("#allPlays").append("<p>Results:" + "</p>");
    $("#allPlays").append("<ul>");
    $("#allPlays").append("<li>Matched 0 == " + numberWithCommas(this.gameMatches[0]) + "</li>");
    $("#allPlays").append("<li>Matched 1 == " + numberWithCommas(this.gameMatches[1]) + "</li>");
    $("#allPlays").append("<li>Matched 2 == " + numberWithCommas(this.gameMatches[2]) + "</li>");
    $("#allPlays").append("<li>Matched 3 == " + numberWithCommas(this.gameMatches[3]) + "</li>");
    $("#allPlays").append("<li>Matched 4 == " + numberWithCommas(this.gameMatches[4]) + "</li>");
    $("#allPlays").append("<li>Matched 5 == " + numberWithCommas(this.gameMatches[5]) + "</li>");
    $("#allPlays").append("<li>Matched 6 == " + numberWithCommas(this.gameMatches[6]) + "</li>");
    $("#allPlays").append("</ul>");
    $("#allPlays").append("<p>Total Won: $" + numberWithCommas(this.amtWon) + "</p>");
    $("#allPlays").append("<p>Total Spent: $" + numberWithCommas(this.amtSpent) + "</p>");
    if (this.netWon > 0) {
      $("#allPlays").append("<h3 style=\"color:green;\"><strong>You won $" + numberWithCommas(this.netWon) + ".</strong></h3>");
    } else if (this.netWon == 0) {
      $("#allPlays").append("<h3 style=\"color:green;\"><strong>You broke even.</strong></h3>");
    } else {
      $("#allPlays").append("<h3 style=\"color:darkred;\"><strong>You lost $" + numberWithCommas(Math.abs(this.netWon)) + "!</strong></h3>");
    }
  }
};

// LOTTO OBJECT
var lottoSim = {
  name: "Lotto Simulator",
  costPerPlay: 2,
  balls: 6,
  minBall: 1,
  maxBall: 49,
  prizes: [0,0,0,2,20,1000,2000000], // sample prize distribution at https://www.palottery.state.pa.us/Games/Match-6.aspx
                                     // sample prize distribution at https://www.palottery.state.pa.us/Games/Match-6/Prizes-Chances.aspx
  play: function(plays) {
    // Declare variables
    var myNumbers, roll, matches, hits, net;
    var games = 0;
    var gameMatches = [0, 0, 0, 0, 0, 0, 0]
    var amtSpent = 0;
    var amtWon = 0;
    var netWon = 0;

    // Run the lotto
    for (m = 0; m < plays; m++) {
      // Choose numbers
      myNumbers = this.chooseBalls(this.balls, this.minBall, this.maxBall);
      // Choose roll
      roll = this.chooseBalls(this.balls, this.minBall, this.maxBall);
      // Get your response
      // https://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript#1885569
      // https://stackoverflow.com/questions/16227197/compute-intersection-of-two-arrays-in-javascript
      matches = myNumbers.filter(function(n) {
          return roll.indexOf(n) !== -1;
      });
      // Calculate results
      hits = matches.length;
      net = -1 * this.costPerPlay + this.prizes[hits];

      // Update totals
      games++;
      gameMatches[hits] += 1;
      amtSpent += 1 * this.costPerPlay;
      amtWon += 1 * this.prizes[hits];
      netWon += net;
    }
    var resultsArray = [myNumbers, roll, matches, hits, net, games, gameMatches, amtSpent, amtWon, netWon];
    return resultsArray;
  },
  chooseBalls: function(lottoBalls, min, max) {
    var temp, match;
    var array = [];
    // check to see if match
    for (i = 0; i < lottoBalls; i++) {
      // generate new number
      temp = getRandomInt(min, max);
      match = 0;
      // see if not already in list
      for (j = 0; j < array.length; j++) {
        if (temp == array[j]) {
          match += 1;
        }
      }
      // push if no match yet
      if (match == 0) {
        array.push(temp);
      } else {
        i--;
      }
    }
    return array;
  },
  printPrice: function() {
    $("#play1").text("Spend $" + numberWithCommas(this.costPerPlay * 1) + " for 1 ticket");
    $("#play10").text("Spend $" + numberWithCommas(this.costPerPlay * 10) + " for 10 tickets");
    $("#play100").text("Spend $" + numberWithCommas(this.costPerPlay * 100) + " for 100 tickets");
    $("#play1000").text("Spend $" + numberWithCommas(this.costPerPlay * 1000) + " for 1,000 tickets");
    $("#play1000000").text("Spend $" + numberWithCommas(this.costPerPlay * 1000000) + " for 1,000,000 tickets");
    return null;
  }
};

// EVENT HANDLERS
$( ".rulesInput" ).change(function( event ) {
  event.preventDefault();
  // alert( "Handler for .submit() called." );
  if ( $("#maxBall").val() < 10 ) {
    alert ( "Maximum number must be 10 or greater.");  // Handle error if ballMax < 10
    lottoSim.maxBall = 10;
    $("#maxBall").val(10);
  } else if ( $("#maxBall").val() > 1000 ) {
    alert ( "Maximum number must be 1000 or less.");  // Handle error if ballMax > 1000
    lottoSim.maxBall = 1000;
    $("#maxBall").val(1000);
  } else {
    lottoSim.costPerPlay = $("#costPerPlay").val() * 1;
    lottoSim.maxBall = $("#maxBall").val() * 1;
    lottoSim.prizes[0] = $("#prize0").val() * 1;
    lottoSim.prizes[1] = $("#prize1").val() * 1;
    lottoSim.prizes[2] = $("#prize2").val() * 1;
    lottoSim.prizes[3] = $("#prize3").val() * 1;
    lottoSim.prizes[4] = $("#prize4").val() * 1;
    lottoSim.prizes[5] = $("#prize5").val() * 1;
    lottoSim.prizes[6] = $("#prize6").val() * 1;
    lottoSim.printPrice();
  }
});

$( "input[type='reset']" ).on("click", function( event ) {
  $(this).closest('form').get(0).reset();
  lottoSim.costPerPlay = $("#costPerPlay").val() * 1;
  lottoSim.maxBall = $("#maxBall").val() * 1;
  lottoSim.prizes[0] = $("#prize0").val() * 1;
  lottoSim.prizes[1] = $("#prize1").val() * 1;
  lottoSim.prizes[2] = $("#prize2").val() * 1;
  lottoSim.prizes[3] = $("#prize3").val() * 1;
  lottoSim.prizes[4] = $("#prize4").val() * 1;
  lottoSim.prizes[5] = $("#prize5").val() * 1;
  lottoSim.prizes[6] = $("#prize6").val() * 1;
  lottoSim.printPrice();
});

$( "#play1" ).click(function() {
  // event.preventDefault();
  wallet.buyTicket(1);
  wallet.printLastPlay();
  wallet.printTotals();
});

$( "#play10" ).click(function() {
  wallet.buyTicket(10);
  wallet.printLastPlay();
  wallet.printTotals();
});

$( "#play100" ).click(function() {
  wallet.buyTicket(100);
  wallet.printLastPlay();
  wallet.printTotals();
});

$( "#play1000" ).click(function() {
  wallet.buyTicket(1000);
  wallet.printLastPlay();
  wallet.printTotals();
});

$( "#play1000000" ).click(function() {
  wallet.buyTicket(1000000);
  wallet.printLastPlay();
  wallet.printTotals();
});

$( "#startOver" ).click(function() {
  wallet.startOver();
});
