const StatsService = require("../services/stats.service");
exports.getStats = async (req, res) => {
    try{
        //Extraemos los valores del campo 'dna' recibido en el cuerpo
        const dna = req.body.dna;     

        // Validamos que el campo 'dna' este siendo enviado en el body del request.
        if(!dna)
            return res.status(400).send({error: true, code: 400, message: 'Value `dna` is required.'});

        const response = await StatsService.getStats(dna);

        res.status(response.code).send(response);
    }catch (err){
        console.log(err);
        res.send({error: true, code: 500, message: `${err}`});
    }
};