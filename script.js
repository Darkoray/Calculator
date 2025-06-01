'use strict';

// * User Inputs
checkInput('.clear', 'clear');
checkInput('.backspace', 'backspace');

for (let i = 0; i <= 9; i++) checkInput(`.numb--${i}`, i);
checkInput('.numb--dot', '.');

/* const operatorArr = [
  { name: 'add', symbol: '+' },
  { name: 'sub', symbol: '-' },
  { name: 'multi', symbol: '*', display: '×' },
  { name: 'divi', symbol: '/', display: '÷' },
  { name: 'equal', symbol: '=' },
];

for (let i = 0; i < operatorArr.length; i++)
checkInput(`.operator--${operatorArr[i].name}`, operatorArr[i].symbol); */

const operatorObj = {
  add: { symbol: '+' },
  sub: { symbol: '-' },
  multi: { symbol: '*', display: '×' },
  divi: { symbol: '/', display: '÷' },
  equal: { symbol: '=' },
};

for (const key of Object.keys(operatorObj)) {
  checkInput(`.operator--${key}`, operatorObj[key].symbol);
}

// * Storage
let storage = [''],
  currentNum = storage[storage.length - 1];

// * Initialization
function init() {
  // storage = [];
  // display();
}

// * Calculates the Inputs
function calc(action) {
  console.log(...action);
  // if ((inputs[0] = '')) {
  // }
}

// * Displays User Inputs
function display() {
  document.querySelector('.screen').textContent = [
    ...storage,
    currentNum,
  ].join(' ');
  console.log(currentNum);
}

function operators(output) {
  for (const key of Object.keys(operatorObj))
    if (operatorObj[key].symbol === output) return true;
}

// Changes Key AC(all clear) to C(clear)
document.querySelector('.clear').textContent =
  [...storage].length > 0 ? 'C' : 'AC';

// * Handles user input events and does calculator actions
function checkInput(className, output) {
  document.querySelector(className).addEventListener('click', () => {
    // - Number
    if (typeof output === 'number' || output === '.') {
      currentNum += output;
      display();
    }

    // - Operator
    else if (operators(output)) {
      storage.push(currentNum, output);
      // If the Operator is Equal then calculate
      if (output === '=') calc(storage);
      else {
        currentNum = '';
        display();
      }
    }

    // - Backspace
    else if (output === 'backspace') {
      if (storage.length > 0) {
        const lastValue = storage.length - 1;
        storage.pop([lastValue]);
      }

      // else if (currentNum) currentNum = currentNum.slice(0, -1);
      // display();
    }

    // - Clear
    else if (output === 'clear') init();
  });
}
