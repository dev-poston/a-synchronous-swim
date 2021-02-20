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

  if (req.method === 'GET') {
    if (req.url !== '/background.jpg') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
      next();
    }
    if (req.url === '/background.jpg') {
      fs.readFile(exports.backgroundImageFile, function (err, data) {
        //console.log('data:', data);
        if (err) {
          res.writeHead(404, headers);
          res.end();
          next();
        } else {
          res.writeHead(200, headers);
          res.write(data);
          res.end();
          next();
        }
      });
    }
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }
  // if (req.method === 'POST') {

  // }
  // next(); // invoke next() at the end of a request to help with testing!
};