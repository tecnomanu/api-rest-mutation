//Creamos el esquema para poder guardar (si corresponde) las cadenas que se envien en cada request
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

//Creamos el Scheme de los ADN para poder buscar e insertar
//resultados en la base de datos.
var DNASequenceSchema = new Schema({
  dna: { type: Array },
  hasMutation: { type:Boolean}
});

module.exports = mongoose.model("DNASequence", DNASequenceSchema);