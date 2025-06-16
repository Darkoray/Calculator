'use strict';

// * User Inputs
handleUserInput('.clear', 'Escape'); //clear key
handleUserInput('.backspace', 'Backspace'); //backspace key

for (let i = 0; i <= 9; i++) handleUserInput(`.numb--${i}`, i);
handleUserInput('.numb--dot', '.'); //all the numbers and '.' keys

const operatorObj = {
  add: { action: '+' },
  sub: { action: '-' },
  multi: { action: '*', display: '×' },
  divi: { action: '/', display: '÷' },
  equal: { action: 'Enter' },
};
for (const key of Object.keys(operatorObj))
  handleUserInput(`.operator--${key}`, operatorObj[key].action); // operator keys

// * States
let storage = [''];
let history = [];
let escapeCount = 0;

// * Displays User Inputs
function display(extra) {
  const displayStorage = function () {
    const tempStorage = [...storage];
    for (let i = 0; i < tempStorage.length; i++) {
      // Changes operatorObj's action to display
      for (const key of Object.keys(operatorObj)) {
        if (
          operatorObj[key].action === tempStorage[i] &&
          operatorObj[key].display
        )
          tempStorage[i] = operatorObj[key].display;
      }

      // Formats numbers
      if (!isNaN(tempStorage[i]) && tempStorage[i] !== '')
        tempStorage[i] = Number(tempStorage[i]).toLocaleString();
    }
    return tempStorage.join(' ');
  };

  if (!isNaN(extra)) extra = extra.toLocaleString(); // Formats numbers

  // Displays the expressions and results
  document.querySelector('.display').innerHTML =
    `<div class='line-1' ${extra != null ? "style='opacity:0.7'" : ''}>
    ${displayStorage()}</div>` +
    (extra != null
      ? `<div class='line-2'>
      ${extra}</div>`
      : '');
}

//* Updates UI(s)
function updateUI() {
  // History counts
  document.querySelector('.history-count').textContent =
    history.length === 0 ? '' : history.length;

  // AC and C
  document.querySelector('.clear').textContent =
    history.length === 0 && storage[0] === '' ? 'AC' : 'C';
}

//* checks if the output is an operator
function operators(output) {
  for (const key of Object.keys(operatorObj))
    if (operatorObj[key].action === output) return true;
}

// # Does calculator actions based on keys
function processInput(value) {
  let StrLastIndex = storage.length - 1; // Last index of storage
  let HstLastIndex = history.length - 1; // Last index of History

  switch (true) {
    // - Number
    case typeof value === 'number' || value === '.':
      if (value === '.' && storage[StrLastIndex].includes('.')) return; //Prevents multiple '.'
      // If the last value is a operator then push an empty value
      if (operators(storage[StrLastIndex])) {
        storage.push('');
        StrLastIndex++;
      }
      // If the value is a number following '0' then replace '0'
      if (storage[StrLastIndex] === '0' && value !== '.')
        storage[StrLastIndex] = String(value);
      else storage[StrLastIndex] += value;
      display();
      break;

    // - Operator
    case operators(value):
      // If value is = then calculates the expression
      if (value === operatorObj.equal.action) {
        try {
          const expression = storage.join(' ');
          const answer = eval(expression);
          if (answer === undefined) return; // Prevents invalid answer
          history.push({
            storage: storage,
            expression: expression,
            answer: answer,
          });
          display(answer);
          storage = [''];
        } catch (error) {
          display('Invalid Input!'); // If the expression is invalid
        }
      } else {
        // If last value is an Operator then replaces
        if (operators(storage[StrLastIndex]))
          storage[StrLastIndex] = value;
        else storage.push(value);
        display();
      }
      break;

    // - Backspace
    case value === 'Backspace':
      // If history exists return the last expression to storage
      if (history.length > 0 && storage[0] === '') {
        storage = history[HstLastIndex].storage;
        display(history[HstLastIndex].answer);
        history.pop();
      } else {
        // If the last value is an operator then removes it
        if (operators(storage[StrLastIndex])) storage.pop();
        //  Else If the last value is a number slices the last number
        else if (storage[StrLastIndex])
          storage[StrLastIndex] = storage[StrLastIndex].slice(0, -1);
      }
      display();
      break;

    // - Escape
    case value === 'Escape':
      escapeCount++;
      // If escape count is reached
      if (escapeCount === 2) {
        storage = [''];
        history = [];
        escapeCount = 0;
        display();
        updateUI();
        return;
      }
      // If Storage is not empty
      if (storage[0] !== '') storage = [''];
      // If history exists
      else if (history.length > 0) {
        storage = history[HstLastIndex].storage;
        history.pop();
      }
      display();
      updateUI();
      break;
  }

  // Removes any empty values
  if (storage.length > 1)
    storage = storage.filter((value) => value !== '');

  // Limits history
  if (history.length === 100) history.shift();

  updateUI();
}

// * Handles user input events
function handleUserInput(selector, value) {
  // Click
  document
    .querySelector(selector)
    .addEventListener('click', () => processInput(value));

  // Key press
  document.addEventListener('keydown', (event) => {
    if (String(value) === event.key) processInput(value);
  });
}
