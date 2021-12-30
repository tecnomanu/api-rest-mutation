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

//Requerimos el modelo con el Scheme para poder usarlo en el sistema.
require('./models/dna.model');

//Conectamos con la base de datos y validamos la conexión por consola.
mongoose.connect("mongodb://localhost/dna-mutation", (err, res)=>{
    if(err)
        console.log(`Error on connection to Database: ${err}`);
    else
        console.log(`Connection to DB success`);

    //Inicamos el servidor en el puerto que se haya seteado por el .env
    app.listen(port, () => {
        console.log(`El servidor está inicializado en el puerto ${port}`);
    });
});

//Creamos una ruta de inicio solo para tener una 'hello world' simple de validación.
app.get('/', function (req, res) {
    res.send('Saludos desde express');
});

//Sumamos los archivos de rutas para cada servicio que se genera en el sistema.
const DNARouter = require('./api-routes/dna.route'),
    StatsRouter = require('./api-routes/stats.route');
app.use(DNARouter);
app.use(StatsRouter);

//Agregamos una respuesta customizada para responder al usuario en caso de contactar
//con rutas que no existen (codigo 404)
app.use(function(req, res, next) {
    response = {
        error: true, 
        code: 404, 
        message: 'Forbidden endpoint'
    };
    res.status(404).send(response);
});