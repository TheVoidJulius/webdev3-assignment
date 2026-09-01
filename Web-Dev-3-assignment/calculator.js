const operation = process.argv[2];
const num1 = Number(process.argv[3]);
const num2 = Number(process.argv[4]);

console.log("Smart Utility Calculator");
console.log("------------------------");

if (isNaN(num1) || isNaN(num2)) {
    console.log("Please enter valid numbers.");
}
else if (operation === "add") {
    console.log("Result:", num1 + num2);
}
else if (operation === "subtract") {
    console.log("Result:", num1 - num2);
}
else if (operation === "multiply") {
    console.log("Result:", num1 * num2);
}
else if (operation === "divide") {
    if (num2 === 0) {
        console.log("Cannot divide by zero.");
    } else {
        console.log("Result:", num1 / num2);
    }
}
else {
    console.log("Invalid operation.");
    console.log("Use: add, subtract, multiply, or divide.");
}