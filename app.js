let fs = require("fs");
let historyLib = require("./lib/history");
const axios = require('axios');

let app = {};

app.printHistory = function () {
  let arrhisto = historyLib.arrhisto();
  let arrhistoLength = arrhisto.length;
  console.log(arrhistoLength - 1, `Results:`)
  arrhisto.map(item => {
    console.log(item)
  })
  app.logfile(`Print history`)
}

app.historyfile = function (data1, data2, data3) {
  fs.appendFile(
    __dirname + "/lib/history/history.txt",
    `First Name: ${data1}, Second Name: ${data2}, Love Percentage: ${data3}%` + "\r\n",
    function (err) {
      if (err) throw err;
      console.log("History file updated!");
    }
  )
}


app.logfile = function (command) {
  fs.appendFile(
    __dirname + "/log.txt",
    new Date() + " => " + command + "\r\n",
    function (err) {
      if (err) throw err;
      console.log("Log file updated!");
    }
  )
};


app.calculateLove = function () {
  console.log(`Calculating love ...`)
  let options = {
    method: 'GET',
    url: 'https://love-calculator.p.rapidapi.com/getPercentage',
    params: { fname: process.argv[2], sname: process.argv[3] },
    headers: {
      'x-rapidapi-key': '0b168600abmsh79f9a6cdaf4fc2ep120417jsn341f4e4f7d29',
      'x-rapidapi-host': 'love-calculator.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    console.log(`Percentage of love between ${response.data.fname.toUpperCase()} and ${response.data.sname.toUpperCase()} is: ${response.data.percentage}%`)
    console.log(response.data.result)
    app.historyfile(response.data.fname, response.data.sname, response.data.percentage)
  }).then(response => {
    app.logfile(`Calculate love`)
  })
    .catch(function (error) {
      console.error(error);
    });

}

app.runCommand = function () {
  console.log(`App running`)
  if (process.argv[2] && process.argv[3]) {
    app.calculateLove()
  } else if (process.argv[2] == `history`) {
    app.printHistory()
  } else {
    console.log(`Command no supported`)
  }
}

//Invoque function to run a command
app.runCommand()

