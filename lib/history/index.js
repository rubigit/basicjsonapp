let fs = require("fs");


let histo = {}

histo.arrhisto = function () {

  let historyContent = fs.readFileSync(__dirname + "/history.txt", "utf8")
  let arrayOfHistory = historyContent.split(/\r?\n/)
  return arrayOfHistory
}

module.exports = histo



