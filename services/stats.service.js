const mongoose = require("mongoose");
const DNASequence = mongoose.model('DNASequence');

exports.getStats = async ()=>{
    try {        
        //Realizamos una busqueda en la base agrupando los totales segun la condición de la mutación de cada resultado.
        const stats = await DNASequence.aggregate(
            [
                { 
                    $group : { 
                        '_id' : null, 
                        "count_mutations":  { $sum : {$cond: ["$hasMutation", 1, 0] } }, 
                        "count_no_mutation" :  { $sum : {$cond: ["$hasMutation",  0, 1] } }
                    }
                }
            ]
        );

        // Desestructuramos el indice 0 de stats y conseguimos los objetos que necesitamos para poder retornarlos al Controller.
        const {count_mutations, count_no_mutation} = stats[0];

        // ???? El ratio que se muestra en el ejempl (0,4) solo puede resultar de la división de los mutados contra los no mutados
        // Devuelvo el ratio respectivamente, sin embargo aclaro que tengo dudas de no necesitar resultar del total de pruebas realizadas.
        return { 
            count_mutations,
            count_no_mutation,
            ratio: count_mutations/count_no_mutation 
        };

    } catch (err) {
        // En caso de suceder un error interno, el retorno es distinto y lo pasamos al Catch del controller.
        throw Error(`Internal error on hadMutation: ${err}`)
    }  
};