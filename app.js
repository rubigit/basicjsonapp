let fs = require("fs");
let historyLib = require("./lib/history");
const axios = require('axios');


//create app object
let app = {};

// Append results from API love calculator to the history file
app.historyfile = function (data1, data2, data3, data4) {
  fs.appendFile(
    __dirname + "/lib/history/history.txt",
    `Percentage of love between ${data1} and ${data2} is: ${data3}%. ${data4}` + "\r\n",
    function (err) {
      if (err) throw err;
      console.log("- History updated!");
    }
  )
}


// Append supported commands used in the app to the log file
app.logfile = function (command) {
  fs.appendFile(
    __dirname + "/log.txt",
    new Date() + " => " + command + "\r\n",
    function (err) {
      if (err) throw err;
      console.log("- Log updated!");
    }
  )
};

//Use library to retrieve content of history file
app.printHistory = function () {
  console.log(`> Printing History...`)
  //call method from the library
  //Assigne content of history file
  let arrhisto = historyLib.arrhisto();
  let arrhistoLength = arrhisto.length;
  console.log(`-----------------------------------------------------------`)
  console.log(`\x1b[33m%s\x1b[0m`, ` ${arrhistoLength - 1} RESULTS:`)
  //Print contet of history file
  arrhisto.map((item, index) => {
    if (item.toString().trim() != "") {
      console.log(`\x1b[32m%s\x1b[0m`, ` ${index + 1}.- ${item}`)
    }
  })
  console.log(`-----------------------------------------------------------`)
  //Send command to be recorded in log file
  app.logfile(`Print history`)
  app.consoleOptions()
}

//Call the API love calculator
//Use axios request
app.calculateLove = function () {
  console.log(`> Calculating love ...`)
  let options = {
    method: 'GET',
    url: 'https://love-calculator.p.rapidapi.com/getPercentage',
    //Store the inserted information in an object
    params: { fname: process.argv[2], sname: process.argv[3] },
    headers: {
      'x-rapidapi-key': '0b168600abmsh79f9a6cdaf4fc2ep120417jsn341f4e4f7d29',
      'x-rapidapi-host': 'love-calculator.p.rapidapi.com'
    }
  };

  //Print the results of love calculation
  axios.request(options).then(function (response) {
    console.log(`-----------------------------------------------------------`)
    console.log(`\x1b[33m%s\x1b[0m`, ` RESULT:`)
    console.log(`\x1b[32m%s\x1b[0m`, ` Percentage of love between ${response.data.fname.toUpperCase()} and ${response.data.sname.toUpperCase()} is: ${response.data.percentage}%`)
    console.log(`\x1b[32m%s\x1b[0m`, ` ${response.data.result}`)
    console.log(`-----------------------------------------------------------`)
    //Send the results to be recorded in history file
    app.historyfile(response.data.fname.toUpperCase(), response.data.sname.toUpperCase(), response.data.percentage, response.data.result)
  }).then(response => {
    //Send command to be recorded in log file
    app.logfile(`Calculate love`)
    app.consoleOptions()
  })
    .catch(function (error) {
      console.error(error);
    });
}

//Prompt supported commands
app.consoleOptions = function () {
  console.log(` To continue, please enter the following commands:`)
  console.log(`\x1b[36m%s\x1b[0m`, `   node app.js firstName secondName`, `(To run Love calculator)`)
  console.log(`\x1b[36m%s\x1b[0m`, `   node app.js history`, `(To print History)`)
  console.log(`-----------------------------------------------------------`)
}

//Validate and execute commands
app.runCommand = function () {
  console.log(`> Running App...`, '\n')

  //Transform the third argument to uppercase
  let command2 = process.argv[2]
  if (process.argv[2]) {
    command2 = command2.toUpperCase()
  }

  //Validate and call function based on the provided command
  if (process.argv[2] && process.argv[3] && process.argv.length == 4) {
    app.calculateLove()
  } else if (command2 == `HISTORY` && process.argv.length == 3) {
    app.printHistory()
  } else {
    let msj = ``
    if (!process.argv[2]) {
      msj = 'Please anter a command'
    } else {
      msj = 'Command no supported'
    }
    //Send command to be recorded in log file
    app.logfile(`Invalid command`)
    //Console error message
    console.log(`-----------------------------------------------------------`)
    console.log(`\x1b[31m%s\x1b[0m`, ` Oops! ${msj}.`)
    console.log(`-----------------------------------------------------------`)
    app.consoleOptions()
  }
}



//Invoque function to run a command
app.runCommand()

