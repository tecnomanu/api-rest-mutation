const mongoose = require("mongoose");
const supertest = require('supertest');
const {app, server} = require('../index');

const api = supertest(app);

describe('POST /mutation', function(){
    test('Si hacemos un request con body vacio, retorna error de campos requeridos', async () => {
        await api
        .post('/mutation')
        .expect(400)
        .expect('Content-Type', /application\/jso/)
    })

    test('Probamos un campo "dna" que no posea 6 cadenas', async () => {
        const response = await api.post('/mutation')
            .send({'dna' : ['', '']})
            expect(response.body.error).toBe(true);
            expect(response.status).toBe(400);
            expect(response.body.code).toBe(400);
    })

    test('Probamos un campo "dna" mal formateado devuelva un error', async () => {
        const response = await api.post('/mutation')
            .send({'dna' : ["GTCCG1","CATTCC","TAATGT","TGTGGA","CTTCTA","TTGTCC"]});
            expect(response.body.error).toBe(true);
            expect(response.status).toBe(400);
            expect(response.body.code).toBe(400);
    })

    test('Probamos un campo "dna" con mutación horizontal', async () => {
        const response = await api.post('/mutation')
            .send({'dna' : ["GGGGCC","CATTCC","TACTGT","TGTGGA","CTTCTA","TTGTCC"]})
            expect(response.body.error).toBe(false);
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(200);
    })

    test('Probamos un campo "dna" con mutación vertical', async () => {
        const response = await api.post('/mutation')
            .send({'dna' : ["GTCCGC","GATTCC","GAATGT","GGTGGA","CTTCTA","TTGTCC"]})
            expect(response.body.error).toBe(false);
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(200);
    })

    test('Probamos un campo "dna" con mutación diagonal', async () => {
        const response = await api.post('/mutation')
            .send({'dna' : ["GTCCGA","CGTTCA","TAGTGT","TGTGGA","CTTCTC","TTGTCC"]});
            expect(response.body.error).toBe(false);
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(200);
    })

    test('Probamos un campo "dna" sin mutación', async () => {
        const response = await api.post('/mutation')
            .send({'dna' : ["ATGCGA","CAGTGC","TTATTT","AGACGG","GCGTCA","TCACTG"]});
            expect(response.body.error).toBe(false);
            expect(response.status).toBe(403);
            expect(response.body.code).toBe(403);
    })
})

afterAll(()=>{
    mongoose.connection.close();
    server.close();
})