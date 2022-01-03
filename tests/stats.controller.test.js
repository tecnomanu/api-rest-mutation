const mongoose = require("mongoose");
const supertest = require('supertest');
const {app, server} = require('../index');

const api = supertest(app);

describe('GET /stats', function(){
    test('Esperamos status 200"', async () => {
        await api.get('/stats').expect(200);
    })

    test('Esperamos 3 valores: "count_mutations", "count_no_mutation", "ratio"', async () => {
        const response = await api.get('/stats');
        expect(typeof response.body.count_mutations).toBe('number');
        expect(typeof response.body.count_no_mutation).toBe('number');
        expect(typeof response.body.ratio).toBe('number');
    })

    test('Esperamos "ratio" debería ser igual a "count_mutations" sobre "count_no_mutation"', async () => {
        const response = await api.get('/stats');
        expect(response.body.ratio).toBe(response.body.count_mutations / response.body.count_no_mutation);
    })
})

afterAll(()=>{
    mongoose.connection.close();
    server.close();
})