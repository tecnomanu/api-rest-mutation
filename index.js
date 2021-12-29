const express = require("express"),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override");

//Express, mongoose para manejar las bases de datos.
const app = express(),
    mongoose = require("mongoose");

//Seteamos el .env para poder tomar configuraciones propias del sistema donde se esta corriendo.
require('dotenv').config();
const port = process.env.HTTP_PORT || 3000;

//Hacemos un parse del body por medio del modulo body-parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

app.get('/', function (req, res) {
    res.send('Saludos desde express');
});

const DNARouter = require('./api-routes/dna.route');
app.use(DNARouter);

app.use(function(req, res, next) {
    response = {
        error: true, 
        code: 404, 
        message: 'Forbidden endpoint'
    };
    res.status(404).send(response);
});

mongoose.connect("mongodb://localhost/dna-mutation", (err, res)=>{
    if(err)
        console.log(`Error on connection to Database: ${err}`);
    else
        console.log(`Connection to DB success`);

    app.listen(port, () => {
        console.log(`El servidor está inicializado en el puerto ${port}`);
    });
});
