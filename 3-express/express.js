//require dependencies and get paths---------
const fs = require('fs')
const express = require('express')
const app = express();
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const port = 8000;
//---------------------------

app.get('/pets', (req, res) => {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
        if(err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'text/plain')
            res.send('Server Error')
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.send(petsJSON);
    })
     
})
//------listener------------
app.listen(port, () => {
    console.log('working');
})