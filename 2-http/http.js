'use strict'

const fs = require('fs')
const path = require('path')
const http = require('http')

const petsPath = path.join(__dirname, 'pets.json');
const port = 8000;

const server = http.createServer(function(req, res) {
    if(req.method === 'GET' && req.url === '/pets') {
        fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
            if(err) {
                console.error(err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Internal Server Error');
            }
            res.statusCode = 200
            res.setHeader('Control-Type', 'application/json');
            res.end(petsJSON);
        })
    }


    else if(req.method === 'GET' && req.url === '/pets/0') {
        fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
            if(err) {
                console.err(err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Internal Server Error')
            }
            
            let pets = JSON.parse(petsJSON);
            let petJSON = JSON.stringify(pets[0]);

            res.setHeader('Content-Type', 'application/json');
            res.end(petJSON);
        })
    }
    else if (req.method === 'GET' && req.url === '/pets/1') {
        fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
          if (err) {
            console.error(err.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Internal Server Error');
          }
    
          var pets = JSON.parse(petsJSON);
          var petsJSON = JSON.stringify(pets[1]);
    
          res.setHeader('Content-Type', 'application/json');
          res.end(petsJSON);
        });
      }
      else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Request Ain't Here`);
      }
    });


server.listen(port, function() {
    console.log('listening on port', port)
})