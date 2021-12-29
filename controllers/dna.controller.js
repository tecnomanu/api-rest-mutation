const mongoose = require("mongoose");

exports.hasMutation = async (req, res) => {
    try{
        const dna = req.body.dna;        
        res.status(403).send({error: false, code: 403, message: 'has not had a mutation'})

    }catch (err){
        res.status(504).send({error: true, code: 504, message: 'Error interno.'});
    }
};