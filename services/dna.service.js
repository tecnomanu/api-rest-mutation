const mongoose = require("mongoose");
const DNASequence = mongoose.model('DNASequence');
const validExpMutation = /AAAA|TTTT|CCCC|GGGG/g;

exports.hasMutation = async (dna)=>{
    try {        
        // Validamos que el campo 'dna' sea un array y posea 6 items.
        if(dna.length != 6)
            return {error: true, code: 400, message:`A valid DNA sequence is required.`};

        
        let hadValidMutation = false;

        // Validamos que el array tenga strings validas, segun la documentación se espera solo valores del tipo string A, T, C y G
        // y la secuencia que se muestra en el ejemplo tiene un largo de 6 strings, así que se compara tambien.
        // Usamos la variable 's' referenciando a 'secuencia' o 'sequence'
        const inValid = dna.some((s)=> {
            //Aprovechamos la primer intineración que se realiza para validar las sequencias recibidas
            //para validar los 'horizontales', en caso de haber uno correcto lo utilizaremos para dar retorno valido
            //si el array pasa la prueba.
            if(validExpMutation.test(s))
                hadValidMutation = true;

            return s.length != 6 || s.match(/[ATCG]/gi).length != s.length;
        });   

        //Si el filter encontro alguna secuencia con valores invalidos o no posee 6 caracteres, retornamos un error de validación
        if(inValid)
            return {error: true, code: 400, message: 'A valid DNA sequence is required.'};

        // Or
        // Si paso la prueba de validación y se encontro una mutación de forma vertical, enviamos un 200, sino seguimos buscando.
        // Or
        // Realizamos otra revisión ahora en el campo horizontal, haciendo un mapeo del ADN por cadenas.
        // Or
        // Si no hay resultados horizontales o verticales, buscamos de forma diagonal, intinerando solo lo necesario entre cada array,
        // en casa paso se intenta evitar pasar a una nueva intineración para resultar en el proceso mas liviano posible.
        if(hadValidMutation || hadMutationVertical(dna) || hadMutationDiagonal(dna)){
             //Chequeamos en la base de datos que exista y sino lo guardamos.
             await checkAndSave( dna, true );
             return {error: false, code: 200, message: 'it´s had mutation'}; //Retornamos un mensaje solo para ampliar el examen.
        }
            
        //Como no se realizo una mutación guardamos el valor en la base de datos
        await checkAndSave( dna, false );

        //Como no paso ninguna prueba valida con los test de Expresión que se realizo, retornamos un codigo 403 confirmando que no se encontraron mutaciones.
        return {error: false, code: 403, message: 'Had not mutation'};

    } catch (err) {
        // En caso de suceder un error interno, el retorno es distinto y lo pasamos al Catch del controller.
        throw Error(`Internal error on hadMutation: ${err}`)
    }  
};

//Creamos una función interna para realizar la tarea de buscar el ADN en la base de datos y sino esta, la guardamos.
const checkAndSave = async ( dna, hasMutation ) => {
    await DNASequence.find({dna : dna})
        .then(async dbDNA => { 
            if(dbDNA.length > 0) return;

            //Armamos el objeto del Schema en Mongoose, el cual nos va a permitir interactuar como un modelo y guardarlo.
            const dnaSecuence = new DNASequence({ dna, hasMutation});
            dnaSecuence.save((err, result)=>{
                if (err) console.log(err.message);
                return result;
            }); 
        });
}

// Con esta función revisamos coincidencias verticales
const hadMutationVertical = (dna) => {
    for(let i = 0; i < 6; i++){
        //Buscamos concidencias verticales
        let vertical = dna.map((s)=> s[i]).join('');
        if(validExpMutation.test(vertical)) return true;
    }
}

// Con esta función revisamos coincidencias en las diagonales
const hadMutationDiagonal = (dna) => {
    //Intineramos de a una cada fila y buscamos en descendencia y ascendencia los siguiente 3 caracteres de cada
    //letra en la que este posicionado el puntero.
    for(let x=0; x < dna.length; x++){
        for(var i=0; i < dna[x].length; i++){
            let diag1 = '', diag2 = '';
            for(var c=0; c < 4; c++){
                diag1 += dna[x+c] ? dna[x+c][i+c] : '';
                diag2 += dna[x+c] ? dna[x+c][i-c] : '';
            }

            //Si se encuentran 4 caracteres juntos en cualquier dirección y pasan el test de cadena con mutación, retornamos el true.
            if(diag1.length == 4 && validExpMutation.test(diag1) || diag2.length == 4 && validExpMutation.test(diag2))
                return true;
        }
    }
}