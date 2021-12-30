const StatsService = require("../services/stats.service");

exports.getStats = async (req, res) => {
    try{
        //Consultamos el Services de Stats para conseguir las estadisticas desde la base de datos.
        const response = await StatsService.getStats();
        res.send(response);
    }catch (err){
        res.send({error: true, code: 500, message: `${err}`});
    }
};