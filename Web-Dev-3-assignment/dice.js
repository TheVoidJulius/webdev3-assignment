const crypto = require("crypto");

console.log("Random Dice Generator");
console.log("---------------------");

for (let i = 1; i <= 5; i++) {

    let dice = crypto.randomInt(1, 7);

    console.log("Roll", i, ":", dice);
}