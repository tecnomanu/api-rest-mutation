const express = require("express"),
  StatsController = require("../controllers/stats.controller");

const routes = express.Router();

routes
  .route("/stats")
  .get(StatsController.getStats);

module.exports = routes;