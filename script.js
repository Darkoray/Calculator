'use strict';

// * States
let currentExpr = [''],
  history = [],
  escapeCount = 0,
  inputValue,
  formattedResult;
const historyLimit = 100;

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

// * Displays User Inputs
function display(extra) {
  const displayExpr = function () {
    const tempExpr = [...currentExpr];
    for (let i = 0; i < tempExpr.length; i++) {
      // Changes operatorObj's action to display
      for (const key of Object.keys(operatorObj))
        if (
          operatorObj[key].action === tempExpr[i] &&
          operatorObj[key].display
        )
          tempExpr[i] = operatorObj[key].display;

      // Formats numbers
      if (!isNaN(tempExpr[i]) && tempExpr[i] !== '')
        tempExpr[i] = Number(tempExpr[i]).toLocaleString();
    }
    return tempExpr.join(' ');
  };

  if (!isNaN(extra)) extra = extra.toLocaleString(); // Formats numbers
  formattedResult = extra;

  // Displays the expressions and results
  document.querySelector('.display').innerHTML =
    `<div class='line-1' ${extra != null ? "style='opacity:0.7'" : ''}>
    ${displayExpr()}</div>` +
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
    history.length === 0 && currentExpr[0] === '' ? 'AC' : 'C';

  //- Dev View
  if (document.querySelector('.btn--dev').classList.contains('active')) {
    let lastHistory = history[history.length - 1]; // Last history
    function updateDevPanel(className, content) {
      document.querySelector(className).innerHTML = content;
    }

    // Current State
    updateDevPanel('.current-expr', JSON.stringify(currentExpr) ?? '[]');
    updateDevPanel('.value', inputValue ?? 'Empty');
    updateDevPanel(
      '.value-type',
      !isNaN(inputValue) || inputValue === '.'
        ? 'Number'
        : operators(inputValue)
        ? 'Operator'
        : inputValue === 'Backspace' || inputValue === 'Escape'
        ? 'Function'
        : 'None'
    );
    updateDevPanel('.escape-count', escapeCount ?? '0');

    // Last Calculation
    updateDevPanel('.expression', lastHistory?.expression ?? 'Empty');
    updateDevPanel('.raw-result', lastHistory?.answer ?? 'Empty');
    updateDevPanel('.formatted-result', formattedResult ?? 'Empty');

    // History
    updateDevPanel('.history-length', history.length ?? '0');
    updateDevPanel('.history-limit', historyLimit - 1 ?? 'Undefined');
    updateDevPanel(
      '.history-data',
      (() => {
        if (history.length === 0) return 'No history yet';
        let historyData = '';
        for (let i = 0; i < history.length; i++)
          historyData += `${i + 1}. [ expression: ${
            history[i].expression
          }, answer: ${history[i].answer} ]${
            i !== history.length - 1 ? ',' + '<br />' : ''
          }`;
        return historyData;
      })()
    );
  }
}

//* checks if the output is an operator
function operators(output) {
  for (const key of Object.keys(operatorObj))
    if (operatorObj[key].action === output) return true;
}

// # Does calculator actions based on keys
function processInput(value) {
  inputValue = value; // Stores value
  let ExprLastIndex = currentExpr.length - 1; // Last index of currentExpr
  let HstLastIndex = history.length - 1; // Last index of History

  switch (true) {
    // - Number
    case typeof value === 'number' || value === '.':
      if (value === '.' && currentExpr[ExprLastIndex].includes('.'))
        return; //Prevents multiple '.'
      // If the last value is a operator then push an empty value
      if (operators(currentExpr[ExprLastIndex])) {
        currentExpr.push('');
        ExprLastIndex++;
      }
      // If the value is a number following '0' then replace '0'
      if (currentExpr[ExprLastIndex] === '0' && value !== '.')
        currentExpr[ExprLastIndex] = String(value);
      else currentExpr[ExprLastIndex] += value;
      display();
      break;

    // - Operator
    case operators(value):
      // If value is = then calculates the expression
      if (value === operatorObj.equal.action) {
        try {
          const expression = currentExpr.join(' ');
          const answer = eval(expression);
          if (answer === undefined) return; // Prevents invalid answer
          history.push({
            currentExpr,
            expression,
            answer,
          });
          display(answer);
          currentExpr = [''];
        } catch (error) {
          display('Invalid Input!'); // If the expression is invalid
        }
      } else {
        // If last value is an Operator then replaces
        if (operators(currentExpr[ExprLastIndex]))
          currentExpr[ExprLastIndex] = value;
        else currentExpr.push(value);
        display();
      }
      break;

    // - Backspace
    case value === 'Backspace':
      // If history exists return the last expression to currentExpr
      if (history.length > 0 && currentExpr[0] === '') {
        currentExpr = history[HstLastIndex].currentExpr;
        history.pop();
      } else {
        // If the last value is an operator then removes it
        if (operators(currentExpr[ExprLastIndex])) currentExpr.pop();
        //  Else If the last value is a number slices the last number
        else if (currentExpr[ExprLastIndex])
          currentExpr[ExprLastIndex] = currentExpr[ExprLastIndex].slice(
            0,
            -1
          );
      }
      display();
      break;

    // - Escape
    case value === 'Escape':
      escapeCount++;
      // If escape count is reached
      if (escapeCount === 2) {
        currentExpr = [''];
        history = [];
        escapeCount = 0;
        display();
        updateUI();
        return;
      }
      // If currentExpr is not empty
      if (currentExpr[0] !== '') currentExpr = [''];
      // If history exists
      else if (history.length > 0) {
        currentExpr = history[HstLastIndex].currentExpr;
        history.pop();
      }
      display();
      updateUI();
      break;
  }

  // Removes any empty values
  if (currentExpr.length > 1)
    currentExpr = currentExpr.filter((value) => value !== '');

  // Limits history
  if (history.length === historyLimit) history.shift();

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

// Guide and Dev View
for (let i = 0; i < 2; i++) {
  const btns = [
    document.querySelector('.btn--guide'),
    document.querySelector('.btn--dev'),
  ];
  const secs = [
    document.querySelector('.guide'),
    document.querySelector('.dev-panel'),
  ];

  const x = i === 0 ? 1 : 0;
  btns[i].addEventListener('click', () => {
    secs[i].classList.remove('hidden');
    secs[x].classList.add('hidden');
    btns[i].classList.add('active');
    btns[x].classList.remove('active');
  });
}

updateUI();
