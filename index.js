/* eslint-disable no-console */
/*
index.js: entry file
development: webpack ./src/index.js -o ./build/built.js --mode=development
*/
import data from './src/data.json';
import './assets/scss/index.scss';

console.log(data);

// document.body.appendChild(`<div>aaa</div>`);

const add = (x, y) => x + y;

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('resolved');
    resolve();
  }, 5000);
});

promise.then(() => {
  console.log('then');
});

console.log(add(1, 2));
console.log(add(1, 2));
