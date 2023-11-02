'use strict'
//require modules==============
const fs = require('fs')
const http = require('http')
const path = require('path')
//set path to pets.json, set port to 8000
const petsPath = path.join(__dirname, 'pets.json');
const port = 8000;
let index;

const server = http.createServer((req, res) => { // create server
    if (req.method === 'GET' && req.url === '/pets') {
        fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
            if (err) {
                console.error(err.stack);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Server Error');
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(petsJSON);
        });
    } else if (req.method === 'GET' && req.url.startsWith('/pets/')) {
        const parts = req.url.split('/');
        if (parts.length === 3) {
            const index = parseInt(parts[2]);
            if (isNaN(index)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('Invalid index');
            }
            fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
                if (err) {
                    console.error(err.stack);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    return res.end('Server Error');
                }
                const pets = JSON.parse(petsJSON);
                if (index < 0 || index >= pets.length) {
                    res.statusCode = 404; 
                    res.setHeader('Content-Type', 'text/plain');
                    return res.end('Pet not found');
                }
                const petJSON = JSON.stringify(pets[index]);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(petJSON);
            });
        } else {
            res.statusCode = 400; 
            res.setHeader('Content-Type', 'text/plain');
            res.end('Invalid URL');
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }
});

server.listen(port, function() {
    console.log('listening on port', port)
})