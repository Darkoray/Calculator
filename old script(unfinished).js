'use strict';

// Calculator operators and their symbols
const operatorArr = [
  { name: 'add', symbol: '+' },
  { name: 'sub', symbol: '-' },
  { name: 'multi', symbol: '*' },
  { name: 'divi', symbol: '/' },
  { name: 'equal', symbol: '=' },
];

const storage = [];
const tempStorage = [];

// Detects user inputs
const userInput = function () {
  for (let i = 0; i <= 9; i++) getInput(`.numb--${i}`, i);
  for (let i = 0; i < operatorArr.length; i++) {
    getInput(`.operator--${operatorArr[i].name}`, operatorArr[i].symbol);
  }
  getInput('.numb--dot', '.');
  getInput('.clear', 'clear');
  getInput('.backspace', 'backspace');
};

function getInput(className, input) {
  document.querySelector(className).addEventListener('click', function () {
    const display = document.querySelector('.screen');

    // tempStorage.push(input);
    // display.textContent = tempStorage.join('');

    // const [inputNum1, inputNum2, ...inputNumbs] = input;
    switch (typeof input) {
      case 'number':
        tempStorage.push(input);
        display.textContent = tempStorage.join('');
        // tempStorage[0] += tempStorage[0 + 1];
        console.log(tempStorage[0], tempStorage[0 + 1]);
        break;

      case 'string':
        console.log('string');
        break;
    }

    // Changes Key AC(all clear) to C(clear)
    document.querySelector('.clear').textContent =
      tempStorage.length > 0 ? 'C' : 'AC';
  });
}
userInput();
