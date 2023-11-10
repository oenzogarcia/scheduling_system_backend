const request = require('supertest');
const { app } = require('./server');

describe('Test my loginRegisterController',  () => {
    it('Deve retornar "O campo first_name não foi fornecido."', async () => {
        const response = await request(app).post('/user').send({
            "last_name": "Batista",
            "cpf": "098.096.765-10",
            "email": "mariaa@gmail.com",
            "password": "82077877Ab"
        });

        expect(response.body.message).toEqual('O campo first_name não foi fornecido.');
    })

    it('Deve retornar "O campo last_name não foi fornecido."', async () => {
    const response = await request(app).post('/user').send({
        "first_name": "Gustavo",
        "cpf": "098.096.765-10",
        "email": "mariaa@gmail.com",
        "password": "82077877Ab"
    });

    expect(response.body.message).toEqual('O campo last_name não foi fornecido.');
})
});