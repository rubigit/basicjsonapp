//import library
let fs = require("fs");

//create names object
let names = {}

//Read malenames file and sotore content into an array
names.arrMale = function () {
    let maleContent = fs.readFileSync(__dirname + "/malenames.txt", "utf8")
    let arrayOfMale = maleContent.split(/\r?\n/)
    //Return  array
    return arrayOfMale
}

//Read femalenames file and sotore content into an array
names.arrFemale = function () {
    let femaleContent = fs.readFileSync(__dirname + "/femalenames.txt", "utf8")
    let arrayOfFemale = femaleContent.split(/\r?\n/)
    //Return  array
    return arrayOfFemale
}

//Export names object
module.exports = names