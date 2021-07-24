//import libraries
let fs = require("fs");
let historyLib = require("./lib/history");
let namesLib = require("./lib/rnames");
let mathLib = require("./lib/math");
const axios = require('axios');


//create app object
let app = {};


// Append results from API(love calculator) to the history file
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


// Append used commands to the log file
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
  //Console operation in progress
  console.log(`> Printing History...`)
  //Retrieve array: content of history file
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
  //Call function to prompt supported commands
  app.consoleOptions()
}

//Use libraries to get a random male name from a file
app.getMale = function () {
  let arrMale = namesLib.arrMale()
  let arrMaleLength = arrMale.length
  let randomNumber = mathLib.getRandomNumber(0, arrMaleLength - 1)
  //return a random male name
  return arrMale[randomNumber]
};

//Use libraries to get a random male name from a file
app.getFemale = function () {
  let arrFemale = namesLib.arrFemale()
  let arrFemaleLength = arrFemale.length
  let randomNumber = mathLib.getRandomNumber(0, arrFemaleLength - 1)
  //return a random female name
  return arrFemale[randomNumber]
};

//Call the API love calculator
//Use axios request
app.calculateLove = function (rCommand) {

  //initialize variables
  let firstname = ``
  let secondname = ``
  let randomlove = ``

  //Assigne random names 
  if (rCommand) {
    firstname = app.getMale()
    secondname = app.getFemale()
    randomlove = rCommand + ` `
  }
  //Assigne names provided by user
  else {
    firstname = process.argv[2]
    secondname = process.argv[3]
  }

  //Console operation in progress
  console.log(`> Calculating ${randomlove}love ...`)
  let options = {
    method: 'GET',
    url: 'https://love-calculator.p.rapidapi.com/getPercentage',
    //Send the names to the API
    params: { fname: firstname, sname: secondname },
    headers: {
      'x-rapidapi-key': '0b168600abmsh79f9a6cdaf4fc2ep120417jsn341f4e4f7d29',
      'x-rapidapi-host': 'love-calculator.p.rapidapi.com'
    }
  };

  //Print the results of love calculation
  axios.request(options).then(function (response) {
    console.log(`-----------------------------------------------------------`)
    console.log(`\x1b[33m%s\x1b[0m`, ` ${randomlove.toUpperCase()}CALCULATION RESULT:`)
    console.log(`\x1b[32m%s\x1b[0m`, ` Percentage of love between ${response.data.fname.toUpperCase()} and ${response.data.sname.toUpperCase()} is: ${response.data.percentage}%`)
    console.log(`\x1b[32m%s\x1b[0m`, ` ${response.data.result}`)
    console.log(`-----------------------------------------------------------`)
    //Send the results to be recorded in history file
    app.historyfile(response.data.fname.toUpperCase(), response.data.sname.toUpperCase(), response.data.percentage, response.data.result)
  }).then(response => {
    //Send command to be recorded in log file
    app.logfile(`Calculate ${randomlove}love`)
    //Call function to prompt supported commands
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
  console.log(`\x1b[36m%s\x1b[0m`, `   node app.js random`, `(To run Love calculator randomly)`)
  console.log(`\x1b[36m%s\x1b[0m`, `   node app.js history`, `(To print calculation history)`)
  console.log(`-----------------------------------------------------------`)

}

//Validate and execute commands provided
app.runCommand = function () {
  //Console operation in progress
  console.log(`> Running App...`, '\n')

  //Transform the third argument to uppercase
  let command2 = process.argv[2]
  if (process.argv[2]) {
    command2 = command2.toUpperCase()
  }

  //Validate and call function based on the provided commands
  //two names where provided
  if (process.argv[2] && process.argv[3] && process.argv.length == 4) {
    if (process.argv[2] == "^[a-zA-Z]+$" && process.argv[3] == "^a-zA-Z]+$") {
      app.calculateLove()
    } else {
      console.log(`-----------------------------------------------------------`)
      console.log(`\x1b[31m%s\x1b[0m`, ` Oops! Please provide two names.`)
      console.log(`----------------------------------------------------------- `)
      //Call function to prompt supported commands
      app.consoleOptions()
      //Send command to be recorded in log file
      app.logfile(`Invalid command`)
    }

  }
  //Command is `random`
  else if (command2 == `RANDOM` && process.argv.length == 3) {
    app.calculateLove(`random`)
  } //Command is `history`
  else if (command2 == `HISTORY` && process.argv.length == 3) {
    app.printHistory()
  }//Command is not supported 
  else {
    //Console error message for invalid commands
    let errMsj = `Command not supported`
    if (!process.argv[2]) {
      errMsj = 'Please anter a valid command'
    }
    console.log(`----------------------------------------------------------- `)
    console.log(`\x1b[31m % s\x1b[0m`, ` Oops! ${errMsj}.`)
    console.log(`----------------------------------------------------------- `)
    //Call function to prompt supported commands
    app.consoleOptions()
    //Send command to be recorded in log file
    app.logfile(`Invalid command`)
  }
}

//Invoque function to run a command
app.runCommand()

