//Creamos el esquema para poder guardar (si corresponde) las cadenas que se envien en cada request
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var DNASequenceSchema = new Schema({
  dna: { type: Array },
});

module.exports = mongoose.model("DNASequence", DNASequenceSchema);