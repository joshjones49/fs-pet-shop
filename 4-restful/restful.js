const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
//====GLOBAL VARIABLES====================>
const petsPath = path.join(__dirname, 'pets.json');
const port = 8000;
//====/PETS PATH==========================>
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
//=====/PETS/INDEX PATH=====================>
app.get('/pets/:index', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      res.status = 500
      return res.send('Server Error')
    }

    const pets = JSON.parse(petsJSON);
    const index = parseInt(req.params.index);

    if (isNaN(index)|| index < 0 || index >= pets.length) {
      res.status = 404
      res.send('Not Found');
      return;
    }
    res.status = 200
    res.json(pets[index]);
  });
});
//===============POST==========================>
app.post('/pets', (req, res) => {
    fs.readFile(petsPATH, 'utf8', (err, petsJSON) => {
        if(err) {
            res.status(500).send('Server Error')
        }
        const pets = JSON.parse(petsJSON)
        const newPet = {
            name: req.body.name,
            age: req.body.age,
            kind: req.body.kind
        }
        pets.push(newPet)
        const updatedList = JSON.stringify(pets, null, 2)
        fs.writeFile(petsPATH, updatedList, (err, data) => {
            if(err) {
                console.log(err);
                res.status(500).send('Server Error')
            }
            res.status(200).send(updatedList)
            console.log(req.body);
        })
    })
})
//===================PATCH=================>
app.patch('/pets/:index', (req, res) => {
    fs.readFile(petsPATH, 'utf8', (err, petsJSON) => {
        if(err) {
            res.status(500).send('Server Error')
        }
        const pets = JSON.parse(petsJSON);
        const index = parseInt(req.params.index);

        if (isNaN(index)|| index < 0 || index >= pets.length) {
            res.status = 404
            res.send('Not Found');
            return;
          }
          
    })
})
//========================DELETE 1====================>
app.delete('/pets/:index', (req, res) => {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        res.status = 500
        return res.send('Server Error')
      }
      //====turn into JS readable object====>
      const pets = JSON.parse(petsJSON);
      //====turn index into an integer====>
      const index = parseInt(req.params.index);
  
      if (isNaN(index)|| index < 0 || index >= pets.length) {
        res.status = 404
        res.send('Not Found');
        return;
      }
      //===delete pet======>
      pets.splice(index, 1); 
      //====stringify array of pets, callback param is null, 2 is the indent spacing======>
      const updatedList = JSON.stringify(pets, null, 2) 
      fs.writeFile(petsPath, updatedList, (err, petsJSON) => {
        if(err) {
            res.status(500).send('Server Error');
            return;
        }
        res.status(204).send();
      })
    });
  });
//=====SET PORT TO LISTEN====================>
app.listen(port, () => {
  console.log(`Server Running`);
});