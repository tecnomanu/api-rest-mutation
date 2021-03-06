const DNAService = require("../services/dna.service");

exports.hasMutation = async (req, res) => {
    try{
        //Extraemos los valores del campo 'dna' recibido en el cuerpo
        const dna = req.body.dna;     

        // Validamos que el campo 'dna' este siendo enviado en el body del request.
        if(!dna)
            return res.status(400).send({error: true, code: 400, message: 'Value `dna` is required.'});

        //Consultamos hasMutation en el Service de los ADN.
        const response = await DNAService.hasMutation(dna);

        //Retornamos el resultado que respondio el metodo hasMutation anterior.
        res.status(response.code).send(response);
    }catch (err){
        res.send({error: true, code: 500, message: `${err}`});
    }
};