const isEven = require("./isEven");

console.log("Custom Module Demo");
console.log("------------------");

let number = 10;

if (isEven(number)) {
    console.log(number, "is an even number.");
} else {
    console.log(number, "is an odd number.");
}

number = 7;

if (isEven(number)) {
    console.log(number, "is an even number.");
} else {
    console.log(number, "is an odd number.");
}