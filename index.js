const express = require("express");
const bodyParser = require('body-parser');
const app = express();

require('dotenv').config();
const port = process.env.HTTP_PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function (req, res) {
    res.send('Saludos desde express');
});


app.get('/mutation', function (req, res) {
    try{
        const dna = req.body.dna;
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
        
        res.status(403).send({error: false, code: 403, message: 'has not had a mutation'})

    }catch (err){
        res.status(504).send({error: true, code: 504, message: 'Error interno.'});
    }
});

app.get('/stats', function (req, res) {
    res.send({error: false, code: 200});
});

app.use(function(req, res, next) {
    response = {
        error: true, 
        code: 404, 
        message: 'Forbidden endpoint'
    };
    res.status(404).send(response);
});

app.listen(port, () => {
    console.log(`El servidor está inicializado en el puerto ${port}`);
});