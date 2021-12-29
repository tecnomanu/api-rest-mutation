const express = require("express"),
  DNAsequenceCtrl = require("../controllers/dna");

const routes = express.Router();

routes
  .route("/mutation")
  .get(DNAsequenceCtrl.hasMutation);

module.exports = routes;