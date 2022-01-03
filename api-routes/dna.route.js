const express = require("express"),
  DNAsequenceController = require("../controllers/dna.controller");

//Creamos las rutas de mutation para poder consultar cadenas.
const routes = express.Router();

routes
  .route("/mutation")
  .post(DNAsequenceController.hasMutation);

module.exports = routes;