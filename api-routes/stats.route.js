const express = require("express"),
  StatsController = require("../controllers/stats.controller");

//Creamos las rutas 'stats' para poder consultar cadenas las estadisticas.
const routes = express.Router();

routes
  .route("/stats")
  .get(StatsController.getStats);

module.exports = routes;