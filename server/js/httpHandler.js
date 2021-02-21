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
  if (req.method === 'POST' && req.url === '/background.jpg') {
    let imgBuff = Buffer.alloc(0);
    req.on('data', (chunk) => {
      imgBuff = Buffer.concat([imgBuff, chunk]);
      console.log('img', imgBuff)
    });
    req.on('end', () => {
      let filePart = multipart.getFile(imgBuff);
      console.log('FILE:', filePart);
      fs.writeFile(module.exports.backgroundImageFile, filePart.data, (err, data) => {
        if (err) {
          console.log('you have failed');
          res.writeHead(404);
          // res.end();
          // next();
        } else {
          console.log('success');
          res.writeHead(201, headers);
          res.write(filePart.data);
        }
        res.end();
        next();
     });
    });
  }
  // next(); // invoke next() at the end of a request to help with testing!
};