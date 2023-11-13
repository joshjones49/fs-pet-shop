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
//CREATE ONE ============================================
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

//PATCH ONE ======================================
app.patch('/api/pets/:id', async (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) {
        res.status(404).send('Invalid Entry');
        console.log('Invalid Entry');
        return;
    }
    const { age, kind, name } = req.body;

    if (!age && !kind && !name) {
        return res.status(400).json('At least one field required for update');
    }
    try {
        const { rows } = await pool.query(
            'UPDATE pets SET age = COALESCE($1, age), kind = COALESCE($2, kind), name = COALESCE($3, name) WHERE id = $4 RETURNING *',
            [age, kind, name, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.status(200).json(rows[0]);
        console.log('Pet Updated');
    } catch (error) {
        res.status(500).json(error);
        console.error(error);
    }
});

//LISTENER ============================================
app.listen(port, () => {
    console.log('listening');
});