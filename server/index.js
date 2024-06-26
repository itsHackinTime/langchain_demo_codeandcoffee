import 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';


import { config } from './config/ollama.js';

const PORT = process.env.PORT || 8080

const app = express()

app.use(bodyParser.json());

app.get('/config/ollama', config, async (req, res) => {
    
    res.end()
})

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})