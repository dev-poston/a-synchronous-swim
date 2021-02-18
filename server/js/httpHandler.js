const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  res.end(messageQueue());
  next(); // invoke next() at the end of a request to help with testing!
};

// let command = [];
// var swimServerInput = () => {
//   keypress.initialize(input => command += input)
//   console.log(command);
//   return command;
// };

// let randomSwim = () => {
//   let directions = ['up', 'down', 'left', 'right'];
//   let randomNum = directions[Math.floor(Math.random() * directions.length)];
//   return randomNum;
// };