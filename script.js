'use strict';

const bill = document.getElementById('bill');
const custom = document.getElementById('custom');
const people = document.getElementById('people');

const form = document.querySelector('.calculator');
const radio = document.querySelectorAll('.radio-label');

let billVal;
let tipVal;
let peopleNum;

form.addEventListener('reset', () => {
  billVal = tipVal = peopleNum = '';
  valid(bill);
  valid(custom);
  valid(people);
  display();
});
form.addEventListener('input', e => {
  if (e.target.name === 'bill') {
    billVal = inputValidation(e.target, billVal);
  }
  if (e.target.name === 'people') {
    peopleNum = inputValidation(e.target, peopleNum);
  }
  if (e.target.name === 'custom') {
    unselect();
    tipVal = inputValidation(e.target, tipVal);
    tipVal = tipVal / 100;
  }
  if (e.target.name === 'tip') {
    valid(custom);
    custom.value = '';
    tipVal = tipValue();
  }
  display();
});
// keybord
radio.forEach(el => {
  el.addEventListener('focus', e => {
    e.target.addEventListener('keydown', e => {
      if (e.keyCode === 13) {
        unselect();
        const tip = document.getElementById(`${e.target.getAttribute('for')}`);
        tip.checked = true;
        tipVal = Number(tip.value);
      } else return;
    });
  });
});

function unselect() {
  const tip = document.querySelectorAll('input[name="tip"]');
  tip.forEach(el => (el.checked = false));
}

function tipValue() {
  const tip = document.querySelectorAll('input[name="tip"]');
  let checked;
  tip.forEach(el => {
    if (el.checked) checked = el.value;
  });
  return Number(checked);
}

function display() {
  const tip = document.querySelector('.tip-amount').children[1];
  const total = document.querySelector('.total').children[1];
  if (billVal && tipVal && peopleNum) {
    tip.textContent = `$${((billVal * tipVal) / peopleNum).toFixed(2)}`;
    total.textContent = `$${(
      billVal / peopleNum +
      (billVal * tipVal) / peopleNum
    ).toFixed(2)}`;
  } else {
    tip.textContent = `$0.00`;
    total.textContent = `$0.00`;
  }
}

// input validation
function check(input) {
  if (input.name === 'people') {
    const pattern = /^\d*$/;
    return pattern.test(input.value) && input.value.replace(',', '.') > 0;
  } else {
    const pattern = /^\d\d*(\.\d*|\,\d*)?$/;
    return pattern.test(input.value) && input.value.replace(',', '.') > 0;
  }
}

function inputValidation(input, value) {
  if (!input.value) {
    error(input, "Can't be empty");
  } else if (input.value <= 0) {
    error(input, 'Must be greater than 0');
  } else if (!check(input)) {
    error(input, 'Invalid format');
  } else {
    valid(input);
    return (value = Number(input.value.replace(',', '.').replace(/\.$/, '')));
  }
}

// error / valid
function error(el, msg) {
  el.ariaInvalid = true;
  el.classList.add('error');
  const error = el.parentElement.querySelector('p');
  error.textContent = msg;
}
function valid(el) {
  el.ariaInvalid = false;
  el.classList.remove('error');
  const error = el.parentElement.querySelector('p');
  error.textContent = '';
}
