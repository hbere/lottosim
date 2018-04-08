// © 2018 lottosim.website
// VARIABLE DECLARATIONS
let lotto1PrizeArray = [0, 0, 0, 6, 60, 3000, 6000000];
let lotto1PrizeSpecialArray = [0, 0, 0, 0, 0, 0, 0];
const lotto1 = new lotto(1, "6 Balls", 6, 49, false, 0, 2, 3, lotto1PrizeArray, lotto1PrizeSpecialArray);

let lotto2PrizeArray = [0, 0, 0, 10, 500, 1000000];
let lotto2PrizeSpecialArray = [2, 4, 10, 200, 10000, 500000000];
const lotto2 = new lotto(2, "Superball", 5, 69, true, 26, 2, 1, lotto2PrizeArray, lotto2PrizeSpecialArray);

let lotto3PrizeArray = [0, 0, 0, 7, 100, 1000000];
let lotto3PrizeSpecialArray = [4, 4, 7, 100, 50000, 500000000];
const lotto3 = new lotto(3, "Vega Starball", 5, 70, true, 25, 2, 1, lotto3PrizeArray, lotto3PrizeSpecialArray);

let lottery = lotto1;
$(".specialBall").css("display", "none");


// FUNCTIONS
function getRandomInt(min, max) { // return 1 random integer between min and max
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomArray(n, min, max) { // return 1 array of n random integers between min and max
  var randArray = [];
  var temp, match;
  for (i = 0; i < n; i++) {
    temp = getRandomInt(min, max); // generate new number
    match = 0;
    randArray.forEach(function(element, j) {
      if (temp == randArray[j]) {
        match += 1;
      }
    });
    if (match == 0) {
      // push if no match yet
      randArray.push(temp);
    } else {
      i--;
    }
  }
  randArray.sort((a, b) => a - b);
  return randArray;
}

function getZeroArray(n) { // return 1 array of n zeros
  var newZeroArray = [];
  for (i = 0; i < n; i++) {
    newZeroArray[i] = 0;
  }
  return newZeroArray;
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

function makeTable(headerArray, dataArray) { // return a table where:
  // A.  header array == 1 row N columns
  // B.  dataArra == array of arrays
  let newTable = "";
  // create header row
  newTable += "<table><tr class='n'>";
  headerArray.forEach(function(element) {
    newTable += "<th class='m' >" + element + "</th>";
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


// OBJECTS FOR LOTTERY & WALLET
function lotto(
  id,
  name,
  balls,
  ballsMax,
  specialBall = false,
  specialBallsMax = 0,
  cost = 2,
  plays = 1,
  prizeArray,
  prizeSpecialArray
) {
  // RULES
  this.id = id;
  this.name = name; // lottery name
  this.balls = balls; // number of regular balls drawn
  this.ballsMax = ballsMax; // maximum of ball numbers
  this.specialBall = specialBall; // special ball yes or no
  this.specialBallsMax = specialBallsMax; // maximum of special ball numbers
  this.cost = cost; // price per ticket
  this.prizes = prizeArray; // lottery prize array
  this.prizesSpecial = prizeSpecialArray; // special lottery prize array
  this.plays = plays; // plays per ticket purchased
  // LAST DRAW HISTORY
  this.lastDraw = []; // last regular balls drawn
  this.lastSpecial = null; // last special ball drawn
  // MATCHES HISTORY
  this.prizesMatches = getZeroArray(balls+1);
  this.prizesSpecialMatches = getZeroArray(balls+1);
  // METHODS
  this.draw = function() { // updates lastDraw and lastSpecial
    this.lastDraw = this.randomArray();
    if (specialBall === true) {
      this.lastSpecial = this.randomSpecial();
    }
    return null;
  };
  this.randomArray = function() { // returns an array of random numbers for this lottery
    return getRandomArray(this.balls, 1, this.ballsMax);
  };
  this.randomSpecial = function() { // returns one random number between 1 and special ball maximum
    return getRandomInt(1, this.specialBallsMax);
  };
  this.zeroOutMatchesArrays = function() {
    this.prizesMatches = getZeroArray(balls+1);
    this.prizesSpecialMatches = getZeroArray(balls+1);
  };
  this.printPrizeTables = function() { // prints updated tables to html page
    // Construct lottery
    let prizeHeaderArray, matchHeaderArray;
    let matchArray = [];
    let dataBalls = [],
      dataSpecial = [],
      dataMatches,
      dataPrizes,
      dataTotals;
    let zeroArray = getZeroArray(balls+1);
    // Construct prize array
    for (i = 0; i <= balls; i++) {
      dataBalls.push(i);
      dataSpecial.push("");
    }
    dataPrizes = this.prizes;
    lottery.prizesMatches.forEach(function(element) {
      matchArray.push(element);
    });
    if (specialBall === true) {
      Array.prototype.push.apply(dataBalls, dataBalls);
      lottery.prizesSpecialMatches.forEach(function(element) {
        matchArray.push(element);
      });
      dataSpecial.forEach(function(element) {
        dataSpecial.push("+ special ball");
      });
      Array.prototype.push.apply(dataPrizes, this.prizesSpecial);
    }
    dataBalls.forEach(function(element, p) {
      dataBalls[p] += " " + dataSpecial[p];
    });
    // Print prize & match tables
    $(".prizesTable").empty();
    $(".matchesTable").empty();
    if (this.id === 1) {
      prizeHeaderArray = ["Matching Numbers", "Prize"];
      matchHeaderArray = ["Matching Numbers", "N"];
      $(".prizesTable").append(
        makeTable(prizeHeaderArray, [dataBalls, dataPrizes])
      );
      $(".matchesTable").append(
        makeTable(matchHeaderArray, [dataBalls, matchArray])
      );
    } else if (this.id === 2) {
      prizeHeaderArray = ["Matching Numbers", "Prize"];
      matchHeaderArray = ["Matching Numbers", "N"];
      $(".prizesTable").append(
        makeTable(prizeHeaderArray, [dataBalls, dataPrizes])
      );
      $(".matchesTable").append(
        makeTable(matchHeaderArray, [dataBalls, matchArray])
      );
    } else if (this.id === 3) {
      prizeHeaderArray = ["Matching Numbers", "Prize"];
      matchHeaderArray = ["Matching Numbers", "N"];
      $(".prizesTable").append(
        makeTable(prizeHeaderArray, [dataBalls, dataPrizes])
      );
      $(".matchesTable").append(
        makeTable(matchHeaderArray, [dataBalls, matchArray])
      );
    } else {
      alert("Error");
    }
  }
}

const wallet = {
  // LAST PURCHASED TICKET
  yourNumbers: [],        // your chosen numbers
  yourNumbersMatches: [], // subset of your numbers that matched
  yourSpecial: [],        // your chosen special numbers (if applicable)
  yourSpecialMatches: [], // your chosen special numbers (if match), otherwise empty
  // LAST PURCHASE
  lastNgames: 0,
  lastNnetWon: 0,
  // TOTALS
  plays: 0,
  amtSpent: 0,
  amtWon: 0,
  netWon: 0,
  // choose numbers
  buyTicket: function(plays) { // buy and play a ticket for currently selected lottery game
    this.lastNgames = plays;
    this.lastNnetWon = 0;
    lottery.draw();
    let winningNumbers = lottery.lastDraw;
    let winningSpecial = lottery.lastSpecial;
    let spendings = 0;
    let winnings = 0;
    for (m = 0; m < plays; m++) {
      // Pick lotto numbers
      this.yourNumbers = lottery.randomArray();
      if (lottery.specialBall === true) {  // Update results stats
        this.yourSpecial[0] = lottery.randomSpecial();
      }
      // Update general lotto stats
      this.yourNumbersMatches = matches(this.yourNumbers, winningNumbers);
      this.plays++;
      spendings += lottery.cost;
      // Update ball match stats
      if (lottery.specialBall == false) { // regular lottery
        this.yourSpecialMatches = [];
        lottery.prizesMatches[this.yourNumbersMatches.length]++;
      } else if (lottery.specialBall == true) {
        if (this.yourSpecial[0] == winningSpecial) {
          this.yourSpecialMatches[0] = winningSpecial;
          lottery.prizesSpecialMatches[this.yourNumbersMatches.length]++;
        } else {
          this.yourSpecialMatches = [];
          lottery.prizesMatches[this.yourNumbersMatches.length]++;
        }
      }
      // Update prize stats
      if (lottery.specialBall === true) { // special ball lottery
        if (this.yourSpecial[0] === winningSpecial) { // matched special
          winnings += lottery.prizesSpecial[this.yourNumbersMatches.length];
        } else { // did not match special
          winnings += lottery.prizes[this.yourNumbersMatches.length];
        }
      } else if (lottery.specialBall === false ) { // regular lottery
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
    lottery.printPrizeTables();
    return null;
  },
  startOver: function() {
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
    lottery.zeroOutMatchesArrays();
    this.printTotals();
    return null;
  }
};


// EVENT LISTENERS
$(document).ready(function() {
  lottery.printPrizeTables();
  $("#yourSpecial").empty();
  $(".gameName").text(lottery.name);
});

$("#lotto1").click(function() {
  lottery = lotto1;
  lottery.printPrizeTables();
  $(".gameName").text(lottery.name);
  $(".specialBall").css("display", "none");
  $("#lotto1").css("background-color", "#4CAF50");
  $("#lotto2").css("background-color", "white");
  $("#lotto3").css("background-color", "white");
});

$("#lotto2").click(function() {
  lottery = lotto2;
  lottery.printPrizeTables();
  $(".gameName").text(lottery.name);
  $(".specialBall").css("display", "inline");
  $("#lotto1").css("background-color", "white");
  $("#lotto2").css("background-color", "#4CAF50");
  $("#lotto3").css("background-color", "white");
});

$("#lotto3").click(function() {
  lottery = lotto3;
  lottery.printPrizeTables();
  $(".gameName").text(lottery.name);
  $(".specialBall").css("display", "inline");
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

// EVENT HANDLERS
$( ".rulesInput" ).change(function( event ) {
  event.preventDefault();
  // Error handling for ball values too large or small
  if ( $("#ballsMax").val() < 10 ) {
    alert ( "Maximum number must be 10 or greater.");  // Handle error if ballMax < 10
    lottery.ballsMax = 10;
    $("#ballsMax").val(10);
  } else if ( $("#ballsMax").val() > 1000 ) {
    alert ( "Maximum number must be 1000 or less.");  // Handle error if ballMax > 1000
    lottery.ballsMax = 1000;
    $("#ballsMax").val(1000);
  } else if ( $("#specialBallsMax").val() < 10 ) {
    alert ( "Maximum number must be 10 or greater.");  // Handle error if ballMax < 10
    lottery.specialBallsMax = 10;
    $("#specialBallsMax").val(10);
  } else if ( $("#specialBallsMax").val() > 1000 ) {
    alert ( "Maximum number must be 1000 or less.");  // Handle error if ballMax > 1000
    lottery.specialBallsMax = 1000;
    $("#specialBallsMax").val(1000);
  } else {
    lottery.cost = $("#cost").val() * 1;
    lottery.ballsMax = $("#ballsMax").val() * 1;
    lottery.specialBallsMax = $("#specialBallsMax").val() * 1;
    // lottery.prizes[0] = $("#prize0").val() * 1;
    // lottery.prizes[1] = $("#prize1").val() * 1;
    // lottery.prizes[2] = $("#prize2").val() * 1;
    // lottery.prizes[3] = $("#prize3").val() * 1;
    // lottery.prizes[4] = $("#prize4").val() * 1;
    // lottery.prizes[5] = $("#prize5").val() * 1;
    // lottery.prizes[6] = $("#prize6").val() * 1;
    // lottery.printPrice();
  }
});
