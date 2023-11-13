//DEPENDENCIES =======================================
const express = require('express'); //import express library
const app = express(); //creates an instance if the Express.js application
const pkg = require('pg'); //imports entire 'pg' package
const { Pool } = pkg; //imports pool class 'pg' library
//GLOBAL VARIABLES =========================================
const port = 8000;// set port to 8000
const pool = new Pool ({ //creates instance of a pool
    user: 'postgres',
    host: 'localhost',
    database: 'pets_db',
    password: 'rockets49',
    port: 5432
});
//MIDDLWARE =============================================
app.use(express.json()) //middleware to stringify data as it comes in
//GET ALL ============================================
app.get('/api/pets', async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM pets;')
        res.send(rows)
    } catch (error) {
        res.json(error)
        console.log(error);
    }
});
//GET ONE ==============================================
app.get('/api/pets/:id', async (req, res) => {
    const id = req.params.id;
    if(isNaN(id)) {
        res.status(404).send('Invalid Entry');
        console.log('Invalid Entry');
    }
    try {
        const {rows} = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
        res.status(200).send(rows);
        console.log('Pet Found');
    } catch (error) {
        res.json(error)
        console.log(error);
    }
});
//CREATE ============================================
app.post('/api/pets', async (req, res) => {
    const { age, kind, name } = req.body;

    if (!age || !kind || !name ) {
        return res.status(400).json({ error: 'All fields required' });
    }
     try {
        const {rows} = await pool.query(
            'INSERT INTO pets (age, kind, name) VALUES ($1, $2, $3)',
            [age, kind, name]
        );

        res.status(201).send(rows[0]); //send created entity
    } catch (error) {
        res.status(500).json(error);
        console.error(error);
    }
});

//DELETE ONE ========================================
app.delete('/api/pets/:id', async (req, res) => {
    const id = req.params.id;
    if(isNaN(id) || id < 0 ) {
        res.status(404).send('Not Found')
    }
    try {
        const {rows} = await pool.query('DELETE FROM pets WHERE id = $1', [id]);
        res.status(200).send(rows);
    } catch (error) {
        res.json(error)
        console.log(error);
    }
});

//PATCH ======================================
//LISTENER ============================================
app.listen(port, () => {
    console.log('listening');
});




// //=====DEPENDECIES=======>
// const fs = require('fs');
// const express = require('express');
// const app = express();
// const path = require('path');

// //====GLOBAL VARIABLES====================>
// const petsPath = path.join(__dirname, 'pets.json');
// const port = 8000;

// //===========MIDDLEWARE===========>
// app.use(express.json());

// //====/PETS PATH==========================>
// app.get('/pets', (req, res) => { //if GET req at /pets
//   fs.readFile(petsPath, 'utf8', (err, petsJSON) => { //read file
//     if(err) {
//       res.status(500).send('Server Error') //if error send error
//       return;
//     }
//     res.status(200).send(petsJSON) //else send petsJSON (data)
//     console.log('Request Complete');
//   })
// })

// //=====/PETS/INDEX PATH=====================>
// app.get('/pets/:index', (req, res) => { //if GET req at /pets/index
//   fs.readFile(petsPath, 'utf8', (err, petsJSON) => { //read file
//     if (err) {
//       res.status(500).send('Server Error'); //if error log error
//       return;
//     }
//       //else
//     const pets = JSON.parse(petsJSON); // parse data to make JS obj
//     const index = parseInt(req.params.index); //turn index from string to number

//     if (isNaN(index) || index < 0 || index >= pets.length) { //check if number, less than zero, or if outside the range of data length
//       res.status(404).send('Not Found'); //if so then send 404 error
//       return;
//     }
//     res.status(200).json(pets[index]); //else return pet at index
//     console.log('Request Complete');
//   });
// });

// //===============POST==========================>
// app.post('/pets', (req, res) => { //if POST req at /pets
//     fs.readFile(petsPath, 'utf8', (err, petsJSON) => { //read file
//         if(err) {
//             res.status(500).send('Server Error') //if error send error
//         }
//         const pets = JSON.parse(petsJSON) //parse data to make JS obj
//         const newPet = { // create newPet obj to take in values from the req body
//             age: req.body.age,
//             kind: req.body.kind, 
//             name: req.body.name
//         }
//         pets.push(newPet) //push newPet into the pets array
//         const updatedList = JSON.stringify(pets, null, 2) //create variable with the value of the pets array stringified (JSON.stringify can take 3 parameters, (obj, callback, indentation))
//         fs.writeFile(petsPath, updatedList, (err, data) => { //write to file
//             if(err) {
//                 console.log(err);
//                 res.status(500).send('Server Error') //if error send error
//             }
//             res.status(200).json(updatedList); //else send back updatedList
//         })
//     })
// })

// //===================PATCH=================>
// app.patch('/pets/:index', (req, res) => { //if PATCH req at /pets/index
//     fs.readFile(petsPath, 'utf8', (err, petsJSON) => { //read file
//         if(err) {
//             res.status(500).send('Server Error') //if error send error
//         }
//         const pets = JSON.parse(petsJSON); //turn data into JS obj
//         const index = parseInt(req.params.index); //turn index into number

//         if (isNaN(index)|| index < 0 || index >= pets.length) {
//             res.status(404).send('Not Found') //if req is outside os paramters return 404 error
//             return;
//           } //else
//           const updatedPet = { //create an obj and insert PATCH req data into req pet using spread operator
//             ...pets[index],
//             ...req.body
//           };
//           pets[index] = updatedPet; //pet[index] now has the properties of the updated pet

//           fs.writeFile(petsPath, JSON.stringify(pets, null, 2), (err) => { //write changes to file
//             if(err) {
//                 res.status(500).send('Server Error') //if error send error
//                 return;
//             }
//             res.status(200).send(updatedPet); //else send updatedPet
//           })
//     })
// })

// //========================DELETE 1====================>
// app.delete('/pets/:index', (req, res) => { //if DELETE req at /pets/index
//     fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
//       if (err) {
//         res.status(500).send('Server Error')
//         return;
//       }
//       const pets = JSON.parse(petsJSON); //turn into JS readable object
      
//       const index = parseInt(req.params.index); //turn index into an integer
  
//       if (isNaN(index) || index < 0 || index >= pets.length) {
//         res.status(404).send('Not Found');
//         return;
//       }
//       pets.splice(index, 1); //delete pet
//       const updatedList = JSON.stringify(pets, null, 2) //stringify array of pets, callback param is null, 2 is the indent spacing
//       fs.writeFile(petsPath, updatedList, (err, petsJSON) => {
//         if(err) {
//             res.status(500).send('Server Error');
//             return;
//         }
//         res.status(204).send();
//       })
//     });
//   });

// //=====SET PORT TO LISTEN====================>
// app.listen(port, () => {
//   console.log(`Server Running`);
// });