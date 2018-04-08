// © 2018 lottosim.website
const lotto1 = new lotto(1, "6 Balls", 6, 49, false, 0, 2, 3);
const lotto2 = new lotto(2, "Superball", 5, 69, true, 26, 2, 1);
const lotto3 = new lotto(3, "Vega Starball", 5, 70, true, 25, 2, 1);
let lottery = lotto1;


// EVENT LISTENERS
$(document).ready(function() {
  lottery.printPrizeTables();
  $("#yourSpecial").empty();
  $("#gameName").text(lottery.name);
});

$("#lotto1").click(function() {
  lottery = lotto1;
  lottery.printPrizeTables();
  $("#yourSpecial").empty();
  $("#gameName").text(lottery.name);
  $("#lotto1").css("background-color", "#4CAF50");
  $("#lotto2").css("background-color", "white");
  $("#lotto3").css("background-color", "white");
});

$("#lotto2").click(function() {
  lottery = lotto2;
  lottery.printPrizeTables();
  $("#gameName").text(lottery.name);
  $("#lotto1").css("background-color", "white");
  $("#lotto2").css("background-color", "#4CAF50");
  $("#lotto3").css("background-color", "white");
});

$("#lotto3").click(function() {
  lottery = lotto3;
  lottery.printPrizeTables();
  $("#gameName").text(lottery.name);
  $("#lotto1").css("background-color", "white");
  $("#lotto2").css("background-color", "white");
  $("#lotto3").css("background-color", "#4CAF50");
});

$("#play1").click(function() {
  wallet.buyTicket(1);
  wallet.printTotals();
  $(".start").css("display", "none");
  $(".play").css("display", "block");
  $(".play1").css("display", "block");
});

$("#play10").click(function() {
  wallet.buyTicket(10);
  wallet.printTotals();
  $(".start").css("display", "none");
  $(".play").css("display", "block");
  $(".play1").css("display", "none");
});

$("#play100").click(function() {
  wallet.buyTicket(100);
  wallet.printTotals();
  $(".start").css("display", "none");
  $(".play").css("display", "block");
  $(".play1").css("display", "none");
});

$("#play1000").click(function() {
  wallet.buyTicket(1000);
  wallet.printTotals();
  $(".start").css("display", "none");
  $(".play").css("display", "block");
  $(".play1").css("display", "none");
});

$("#play1000000").click(function() {
  wallet.buyTicket(1000000);
  wallet.printTotals();
  $(".start").css("display", "none");
  $(".play").css("display", "block");
  $(".play1").css("display", "none");
});

$("#startOver").click(function() {
  wallet.startOver();
  $(".start").css("display", "block");
  $(".play").css("display", "none");
  $(".play1").css("display", "none");
});


// FUNCTIONS
function getRandomInt(min, max) { // return a random integer between specified min and max
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function numberWithCommas(x) { // return a number but with commas to mark thousands
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function matches(array1, array2) { // return the number of matching elements in two arrays
  let matches = array1.filter(function(n) {
    return array2.indexOf(n) !== -1;
  });
  return matches;
}

function printArray(array) { // return array as an ordered, space-separated string
  let str = "";
  array.sort((a, b) => a - b); // see https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly#1063027
  array.forEach(function(element, j) {
    str += array[j] + " ";
  });
  return str;
}

function makeTable(headerArray, dataArray) { // make a table where
  // header array == 1 row N columns
  // dataArra == array of arrays
  let newTable = "";
  // create header row
  newTable += "<table><tr class='n'>";
  headerArray.forEach(function(element) {
    newTable += "<td class='m' >" + element + "</td>";
  });
  newTable += "</tr>";
  // create data rows
  dataArray[0].forEach(function(element, i) {  // run once for each of N rows
    newTable += "<tr class='n'>";
    headerArray.forEach(function(element, j) {
      newTable += "<td class='m' >" + dataArray[j][i] + "</td>";
    });
    newTable += "</tr>";
  });
  // return html table
  newTable += "</table>";
  return newTable;
}

function lotto(
  id,
  name,
  balls,
  ballsMax,
  specialBall = false,
  specialBallsMax = 0,
  cost = 2,
  plays = 1
) {
  // RULES
  this.id = id;
  this.name = name; // lottery name
  this.balls = balls; // number of regular balls drawn
  this.ballsMax = ballsMax; // maximum of ball numbers
  this.specialBall = specialBall; // special ball yes or no
  this.specialBallsMax = specialBallsMax; // maximum of special ball numbers
  this.cost = cost; // price per ticket
  this.prizes = [0, 0, 0, 2, 20, 1000, 2000000]; // lottery prize array
  this.prizesSpecial = [0, 0, 0, 0, 0, 0, 0]; // special lottery prize array
  this.plays = plays; // plays per ticket purchased
  // LAST DRAW
  this.lastDraw = []; // last regular balls drawn
  this.lastSpecial = null; // last special ball drawn
  // MATCHES HISTORY
  this.prizesMatches = [0, 0, 0, 0, 0, 0, 0];
  this.prizesSpecialMatches = [0, 0, 0, 0, 0, 0, 0];
  // METHODS
  this.initializePrizes = function(id) { // populate prize array appropriately for lotto type
    if (id === 1) {
      // 6 Balls
      this.prizes = [0, 0, 0, 6, 60, 3000, 6000000];
      this.prizesSpecial = [0, 0, 0, 0, 0, 0, 0];
    } else if (id === 2) {
      // Vega Starball
      this.prizes = [0, 0, 0, 10, 500, 1000000];
      this.prizesSpecial = [2, 4, 10, 200, 10000, 500000000];
    } else if (id === 3) {
      // Superball
      this.prizes = [0, 0, 0, 7, 100, 1000000];
      this.prizesSpecial = [4, 4, 7, 100, 50000, 500000000];
    } else {
      this.prizes = [0, 0, 0, 2, 20, 1000, 2000000];
      this.prizesSpecial = [0, 0, 0, 0, 0, 0, 0];
    }
  };
  this.draw = function() {
    this.lastDraw = this.random();
    if (specialBall === true) {
      this.lastSpecial = this.randomSpecial();
    }
    return null;
  };
  this.random = function() { // returns an array of random numbers; array length = # balls
    let temp, match;
    let array = [];
    for (i = 0; i < this.balls; i++) {
      temp = getRandomInt(1, this.ballsMax); // generate new number
      match = 0;
      array.forEach(function(element, j) {
        if (temp == array[j]) {
          match += 1;
        }
      });
      if (match == 0) {
        // push if no match yet
        array.push(temp);
      } else {
        i--;
      }
    }
    array.sort((a, b) => a - b);
    return array;
  };
  this.randomSpecial = function() { // returns one random number between 1 and special ball maximum
    return getRandomInt(1, this.specialBallsMax);
  };
  this.printPrizeTables = function() { // prints updated tables to html page
    // Construct lottery
    let prizeHeaderArray, matchHeaderArray;
    let dataBalls = [],
      dataSpecial = [],
      dataMatches,
      dataPrizes,
      dataTotals;
    let zeroArray = [];
    // Construct prize array
    this.initializePrizes(id);
    for (i = 0; i <= balls; i++) {
      dataBalls.push(i);
      zeroArray.push(0);
      dataSpecial.push("no");
    }
    dataPrizes = this.prizes;
    if (specialBall === true) {
      Array.prototype.push.apply(dataBalls, dataBalls);
      Array.prototype.push.apply(zeroArray, zeroArray);
      dataSpecial.forEach(function(element) {
        dataSpecial.push("yes");
      });
      Array.prototype.push.apply(dataPrizes, this.prizesSpecial);
    }
    // Print prize & match tables
    $(".prizesTable").empty();
    $(".matchesTable").empty();
    if (this.id === 1) {
      prizeHeaderArray = ["Regular ball matches", "Prize"];
      matchHeaderArray = ["Regular ball matches", "N"];
      $(".prizesTable").append(
        makeTable(prizeHeaderArray, [dataBalls, dataPrizes])
      );
      $(".matchesTable").append(
        makeTable(matchHeaderArray, [dataBalls, zeroArray])
      );
    } else if (this.id === 2) {
      prizeHeaderArray = ["Regular ball matches", "Special ball match?", "Prize"];
      matchHeaderArray = ["Regular ball matches", "Special ball match?", "N"];
      $(".prizesTable").append(
        makeTable(prizeHeaderArray, [dataBalls, dataSpecial, dataPrizes])
      );
      $(".matchesTable").append(
        makeTable(matchHeaderArray, [dataBalls, dataSpecial, zeroArray])
      );
    } else if (this.id === 3) {
      prizeHeaderArray = ["Regular ball matches", "Special ball match?", "Prize"];
      matchHeaderArray = ["Regular ball matches", "Special ball match?", "N"];
      $(".prizesTable").append(
        makeTable(prizeHeaderArray, [dataBalls, dataSpecial, dataPrizes])
      );
      $(".matchesTable").append(
        makeTable(matchHeaderArray, [dataBalls, dataSpecial, zeroArray])
      );
    } else {
      alert("Error");
    }
  }
}

const wallet = {
  // STARTING MONEY
  money: 200,
  // LAST PURCHASED TICKET
  yourNumbers: [],
  yourNumbersMatches: [],
  yourSpecial: [],
  yourSpecialMatches: [],
  // LAST PURCHASE
  lastNgames: 0,
  lastNnetWon: 0,
  // TOTALS
  plays: 0,
  amtSpent: 0,
  amtWon: 0,
  netWon: 0,
  // choose numbers
  buyTicket: function(plays) { // play/buy a ticket for currently selected lottery game
    this.lastNgames = plays;
    this.lastNnetWon = 0;
    lottery.draw();
    let winningNumbers = lottery.lastDraw;
    let winningSpecial = lottery.lastSpecial;
    let spendings = 0;
    let winnings = 0;
    for (m = 0; m < plays; m++) {
      this.yourNumbers = lottery.random(); // Update regular ball stats for my "previous play"
      this.yourNumbersMatches = matches(this.yourNumbers, winningNumbers);
      this.plays++;
      spendings += lottery.cost;
      if (lottery.specialBall === true) {
        // Update special ball stats for "my previous play"
        this.yourSpecial = lottery.randomSpecial();
        if (this.yourSpecial === winningSpecial) {
          this.yourSpecialMatches = [winningSpecial];
        } else {
          this.yourSpecialMatches = [];
        }
      }
      if (lottery.specialBall === true) {
        if (this.yourSpecial === winningSpecial) {
          winnings += lottery.prizesSpecial[this.yourNumbersMatches.length];
        } else {
          winnings += lottery.prizes[this.yourNumbersMatches.length];
        }
      } else {
        winnings += lottery.prizes[this.yourNumbersMatches.length];
      }
    }
    this.lastNnetWon = winnings - spendings;
    this.amtSpent += spendings;
    this.amtWon += winnings;
    this.netWon += this.lastNnetWon;
    return null;
  },
  printTotals: function() { // print wallet totals to html page
    // PREVIOUS PLAY
    $("#lastNgames").text(numberWithCommas(this.lastNgames));
    $("#yourNumbers").text(printArray(this.yourNumbers));
    $("#yourSpecial").text(this.yourSpecial);
    $("#winningNumbers").text(printArray(lottery.lastDraw));
    $("#winningSpecial").text(lottery.lastSpecial);
    $("#yourNumbersMatches").text(printArray(this.yourNumbersMatches));
    $("#yourSpecialMatches").text(printArray(this.yourSpecialMatches));
    $("#matchesN").text(this.yourNumbersMatches.length);
    if (this.yourSpecialMatches.length === 1) {
      $("#matchesSpecial").text(" and the special ball");
    } else {
      $("#matchesSpecial").text("");
    }
    if (this.lastNnetWon > 0) {
      $("#lastNnetWon").text(
        "You won $" + numberWithCommas(Math.abs(this.lastNnetWon))
      );
      $("#lastNnetWon").css("color", "green");
    } else if (this.lastNnetWon == 0) {
      $("#lastNnetWon").text("You broke even.");
      $("#lastNnetWon").css("color", "green");
    } else if (this.lastNnetWon < 0) {
      $("#lastNnetWon").text(
        "You lost $" + numberWithCommas(Math.abs(this.lastNnetWon))
      );
      $("#lastNnetWon").css("color", "darkred");
    }
    // Totals
    $("#plays").text(numberWithCommas(this.plays));
    $("#amtWon").text("$" + numberWithCommas(this.amtWon));
    $("#amtSpent").text("$" + numberWithCommas(this.amtSpent));
    if (this.netWon > 0) {
      $("#netWon").text("You won $" + numberWithCommas(Math.abs(this.netWon)));
      $("#netWon").css("color", "green");
    } else if (this.netWon === 0) {
      $("#netWon").text("You broke even.");
      $("#netWon").css("color", "green");
    } else if (this.netWon < 0) {
      $("#netWon").text("You lost $" + numberWithCommas(Math.abs(this.netWon)));
      $("#netWon").css("color", "darkred");
    }
    return null;
  },
  startOver: function() {
    this.money = 200;
    // LAST PURCHASED TICKET
    this.yourNumbers = [];
    this.yourNumbersMatches = [];
    this.yourSpecial = [];
    this.yourSpecialMatches = [];
    // LAST PURCHASE
    this.lastNgames = 0;
    this.lastNnetWon = 0;
    // TOTALS
    this.plays = 0;
    this.amtSpent = 0;
    this.amtWon = 0;
    this.netWon = 0;
    this.printTotals();
    return null;
  }
};
