//=====DEPENDENCIES=================
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
//====GLOBAL VARIABLES====================
const petsPath = path.join(__dirname, 'pets.json');
const port = 8000;
//====/PETS PATH==========================
app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if(err) {
      res.status = 500
      return res.send('Server Error');
    }
    res.status = 200;
    res.send(petsJSON)
  })
})
//=====/PETS/INDEX PATH=====================
app.get('/pets/:index', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      res.status = 500
      return res.send('Server Error')
    }

    const pets = JSON.parse(petsJSON);
    const index = parseInt(req.params.index);

    if (typeof index !== 'number' || index < 0 || index >= pets.length) {
      res.status = 404
      res.send('Not Found');
      return;
    }
    res.status = 200
    res.json(pets[index]);
  });
});
//=====SET PORT TO LISTEN====================
app.listen(port, () => {
  console.log(`Brain Hurty`);
});