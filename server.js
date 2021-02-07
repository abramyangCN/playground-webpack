// const express = require('express');

// const app = express();

// app.use(express.static('dist', { maxAge: 1000 * 3600 }));

// app.listen(3001);

const path = require('path');

const assets = path.resolve(__dirname, 'src/assets/');

console.log(__dirname);

console.log(assets);
