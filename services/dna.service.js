var DNASequence = require('../models/dna.model')

exports.hasMutation = ()=>{
    try {
        let validExpMutation = /AAAA|TTTT|CCCC|GGGG/g;
        let hadValidMutation = false;

        // Validamos que el campo 'dna' este siendo enviado en el body del request.
        if(!dna)
            return res.status(400).send({error: true, code: 400, message: 'Value `dna` is required.'});
        
        // Validamos que el campo 'dna' sea un array y posea 6 items.
        if(dna.length != 6)
            return res.status(400).send({error: true, code: 400, message: 'A valid DNA sequence is required.'});

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
            return res.status(400).send({error: true, code: 400, message: 'A valid DNA sequence is required.'});

        // Si paso la prueba de validación y se encontro una mutación de forma vertical, enviamos un 200, sino seguimos buscando.
        if(hadValidMutation)
            return res.send({error: false, code: 200, message: 'it´s had mutation (horizontal)'})
        else {
            //Realizamos otra revisión ahora en el campo horizontal, haciendo un mapeo del ADN por cadenas.
            for(let i = 0; i < 6; i++){
                //Buscamos concidencias verticales
                let vertical = dna.map((s)=> s[i]).join('');
                if(validExpMutation.test(vertical))
                    return res.send({error: false, code: 200, message: 'it´s had mutation (vertical)'})
            }

            // Si no hay resultados horizontales o verticales, buscamos de forma diagonal, intinerando solo lo necesario entre cada array,
            // en casa paso se intenta evitar pasar a una nueva intineración para resultar en el proceso mas liviano posible.
            for(let x=0; x < dna.length; x++){
                for(var i=0; i < dna[x].length; i++){
                    let diag1 = '';
                    let diag2 = '';
                    for(var c=0; c < 4; c++){
                        diag1 += dna[x+c] && dna[x+c][i+c] ? dna[x+c][i+c] : '';
                        diag2 += dna[x+c] && dna[x+c][i-c] ? dna[x+c][i-c] : '';
                    }
                    if(diag1.length == 4 
                        && validExpMutation.test(diag1) 
                        || diag2.length == 4 
                        && validExpMutation.test(diag2)
                    ){
                        return res.send({error: false, code: 200, message: 'it´s had mutation (diagonal)'})  
                    }
                }
            }
        }
        
        return users;
    } catch (e) {
        // Log Errors
        throw Error('Error while Paginating Users')
    }  
};