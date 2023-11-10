const request = require('supertest');
const { app } = require('./server');

describe('Teste de validação de registro', () => {
  it('Deve retornar "O campo first_name não foi fornecido."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "last_name": "Batista",
        "cpf": "098.096.765-10",
        "email": "mariaa@gmail.com",
        "password": "82077877Ab"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('O campo first_name não foi fornecido.');
  });

  it('Deve retornar "O campo last_name não foi fornecido."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "cpf": "098.096.765-10",
        "email": "mariaa@gmail.com",
        "password": "82077877Ab"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('O campo last_name não foi fornecido.');
  });

  it('Deve retornar "O campo cpf não foi fornecido."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "last_name": "Batista",
        "email": "mariaa@gmail.com",
        "password": "82077877Ab"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('O campo cpf não foi fornecido.');
  });

  it('Deve retornar "O campo email não foi fornecido."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "last_name": "Batista",
        "cpf": "098.096.765-10",
        "password": "82077877Ab"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('O campo email não foi fornecido.');
  });

  it('Deve retornar "O campo password não foi fornecido."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "last_name": "Batista",
        "cpf": "098.096.765-10",
        "email": "mariaa@gmail.com"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('O campo password não foi fornecido.');
  });
});

describe('Teste de autenticação', () => {
  it('Deve retornar "Se você já possui uma conta, faça login."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "last_name": "Batista",
        "cpf": "098.096.765-10",
        "email": "maria@gmail.com",
        "password": "82077877"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Se você já possui uma conta, faça login.');
  });
});
