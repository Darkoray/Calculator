'use strict';

// * User Inputs
handleUserInput('.clear', 'clear');
handleUserInput('.backspace', 'backspace');

for (let i = 0; i <= 9; i++) handleUserInput(`.numb--${i}`, i);
handleUserInput('.numb--dot', '.');

const operatorObj = {
  add: { symbol: '+' },
  sub: { symbol: '-' },
  multi: { symbol: '*', display: '×' },
  divi: { symbol: '/', display: '÷' },
  equal: { symbol: '=' },
};

for (const key of Object.keys(operatorObj)) {
  handleUserInput(`.operator--${key}`, operatorObj[key].symbol);
}

// * Storage
let storage = [''];
let history = [];

// * Displays User Inputs
function display(extra) {
  const screen = document.querySelector('.screen');
  screen.innerHTML =
    [...storage].join(' ') + (extra ? `<br />${extra}` : '');

  // Changes Key AC(all clear) to C(clear)
  document.querySelector('.clear').textContent =
    storage.length === 1 || !storage[0] === ' ' ? 'AC' : 'C';
}

function operators(output) {
  for (const key of Object.keys(operatorObj))
    if (operatorObj[key].symbol === output) return true;
}

// * Handles user input events and does calculator actions
function handleUserInput(selector, value) {
  document.querySelector(selector).addEventListener('click', () => {
    let lastIndex = storage.length - 1;

    switch (true) {
      // - Number
      case typeof value === 'number' || value === '.':
        if (operators(storage[lastIndex])) {
          storage.push('');
          lastIndex++;
        }
        storage[lastIndex] += value;
        display();
        break;

      // - Operator
      case operators(value):
        // If value is = then calculates the expression
        if (value === '=') {
          try {
            const expression = storage.join(' ');
            const answer = eval(expression);
            display(answer);
            history.push({
              storage: storage,
              expression: expression,
              answer: answer,
            });
            storage = [''];
          } catch (error) {
            display('Invalid Input!'); // If the expression is invalid
          }
        } else {
          // If last value is an Operator then replaces
          if (operators(storage[lastIndex])) storage[lastIndex] = value;
          else storage.push(value);
          display();
        }
        break;

      // - Backspace
      case value === 'backspace':
        // If the last value is an operator then removes it
        if (operators(storage[lastIndex])) {
          storage.pop();
        }
        //  Else If the last value is a number slices the last number
        else if (storage[lastIndex])
          storage[lastIndex] = storage[lastIndex].slice(0, -1);

        display();
        break;

      // - Clear
      case value === 'clear':
        storage = [''];
        display();
        break;
    }
  });
}
