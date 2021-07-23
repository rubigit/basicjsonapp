//import library
let fs = require("fs");

//create histo object
let histo = {}

//Read history file and sotore content into an array
histo.arrhisto = function () {
  let historyContent = fs.readFileSync(__dirname + "/history.txt", "utf8")
  let arrayOfHistory = historyContent.split(/\r?\n/)
  //Return  array
  return arrayOfHistory
}

//Export histo object
module.exports = histo



