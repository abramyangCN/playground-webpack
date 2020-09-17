/* eslint-disable */
/*
index.js: entry file
development: webpack ./src/index.js -o ./build/built.js --mode=development
*/
import data from './data.json';
import './assets/scss/index.scss';
import $ from 'jQuery';

console.log(data);
// document.body.appendChild(`<div>aaa</div>`);

const getComponent = async () => {
  /* eslint-disable-next-line */
  const { default: print } = await import(
    /* webpackChunkName: 'print', webpackPrefetch: true */ './assets/js/print'
  );
  return print;
};

document.getElementById('box').onclick = async () => {
  /* eslint-disable-next-line */
  getComponent()
    .then((print) => {
      console.log(print());
    })
    .catch((err) => {
      console.log(err);
    });
};

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

const sum = (...args) => args.reduce((p, n) => p + n, 0);

console.log(sum(1, 2, 3, 4, 3, 5));

console.log($);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('failed');
      });
  });
}
