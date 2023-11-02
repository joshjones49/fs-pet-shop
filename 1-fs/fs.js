const fs = require('fs');
const {exit} = require('node:process');
//const fs = require('fs'); //common JavaScript
//import pets from '../pets.json';
const petsPath = '../pets.json';

const args = process.argv;
console.log(args);

const action = process.argv[2]
const index = process.argv[3]

if(args.length < 3){
    sendError()
}

function sendError() {
    console.log("Usage: [create | read | update | destroy]")
    exit(1);
}

function startAction() {
if(action === 'read') {
    if(index === undefined) {
        console.log('working');
    }else{
    readPets(index)
    }
}
}

function readPets(index) {

    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        index = parseInt(index);
        const pets = JSON.parse(data);

        if (typeof index === 'number') {
            if (index < 0 || index >= pets.length) {
                console.error('Usage: node fs.js read INDEX')
                process.exit(1);
            }
            console.log(pets[index]);
            exit(0)
        }
        else {
            console.log(pets);
            exit(0)
        }
    });
}

function logAllPets() {
    fs.readFile(petsPath, 'utf8', (err, data) => {

    })
}

startAction()
