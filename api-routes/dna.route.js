const express = require("express"),
  DNAsequenceController = require("../controllers/dna.controller");

const routes = express.Router();

routes
  .route("/mutation")
  .get(DNAsequenceController.hasMutation);

module.exports = routes;