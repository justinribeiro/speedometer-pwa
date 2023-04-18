let n = 8
let a = 34.82
let b = 4.01
let speed = 3.3
let cw = a / (1- Math.pow(speed / b ),2)
let power = (Math.pow(speed,3) * cw / n).toFixed(2);



console.log (n);
console.log(speed);
console.log(cw);
console.log(power)


let wattage = (Math.pow(speed,3) * (a / (1- Math.pow(speed / b ),2)) / n).toFixed(2);
