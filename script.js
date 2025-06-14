'use strict';

// * User Inputs
handleUserInput('.clear', 'clear'); //clear key
handleUserInput('.backspace', 'backspace'); //backspace key

for (let i = 0; i <= 9; i++) handleUserInput(`.numb--${i}`, i);
handleUserInput('.numb--dot', '.'); //all the numbers and '.' keys

const operatorObj = {
  add: { symbol: '+' },
  sub: { symbol: '-' },
  multi: { symbol: '*', display: '×' },
  divi: { symbol: '/', display: '÷' },
  equal: { symbol: '=' },
};

for (const key of Object.keys(operatorObj)) {
  handleUserInput(`.operator--${key}`, operatorObj[key].symbol); // operator keys
}

// * States
let storage = [''];
let history = [];
let clearCount = 0;

// * Displays User Inputs
function display(extra) {
  // Changes operatorObj's symbol to display
  const displayStorage = function () {
    const tempStorage = [...storage];
    for (let i = 0; i < tempStorage.length; i++) {
      for (const key of Object.keys(operatorObj))
        if (
          operatorObj[key].symbol === tempStorage[i] &&
          operatorObj[key].display
        )
          tempStorage[i] = operatorObj[key].display;
    }
    return tempStorage.join(' ');
  };

  // Displays the expressions and results
  document.querySelector('.screen').innerHTML =
    `<div class='line-1' ${extra != null ? "style='opacity:0.7'" : ''}>
    ${displayStorage()}</div>` +
    (extra != null
      ? `<div class='line-2'>
      ${extra}</div>`
      : '');
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
        // If history exists return the last expression to storage
        if (history.length > 0 && storage[0] === '') {
          storage = history[history.length - 1].storage;
          history.pop();
        } else {
          // If the last value is an operator then removes it
          if (operators(storage[lastIndex])) storage.pop();
          //  Else If the last value is a number slices the last number
          else if (storage[lastIndex])
            storage[lastIndex] = storage[lastIndex].slice(0, -1);
        }
        display();
        break;

      // - Clear
      case value === 'clear':
        clearCount++;
        if (clearCount === 1) {
          const line2 = document.querySelector('.line-2');
          if (line2) line2.remove();
        } else if (clearCount === 2) {
          clearCount = 0;
          storage = [''];
          history = [];
        }
        display();
        break;
    }

    // Changes Key AC(all clear) to C(clear)
    document.querySelector('.clear').textContent =
      storage.length > 1 && history.length > 0 ? 'AC' : 'C';

    // Removes any empty values
    if (storage.length > 1)
      storage = storage.filter((value) => value !== '');
  });
}
