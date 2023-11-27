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
        "cpf": "09809676510",
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
        "cpf": "09809676510",
        "email": "mariaa@gmail.com"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('O campo password não foi fornecido.');
  });
});

//Teste Autenticação

describe('Teste de autenticação', () => {
    it('Deve retornar "Se você já possui uma conta, faça login."', async () => {
        const response = await request(app)
        .post('/user')
        .send({
            "first_name": "Gustavo",
            "last_name": "Batista",
            "cpf": "09809676510",
            "email": "maria@gmail.com",
            "password": "82077877"
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Se você já possui uma conta, faça login.');
    });

    it('Deve retornar "Se você já possui uma conta, faça login."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "last_name": "Batista",
        "cpf": "09809676510",
        "email": "mariaa@gmail.com",
        "password": "82077877"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Se você já possui uma conta, faça login.');
  })

    it('Deve retornar "Se você já possui uma conta, faça login."', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        "first_name": "Gustavo",
        "last_name": "Batista",
        "cpf": "09809476510",
        "email": "maria@gmail.com",
        "password": "82077877"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Se você já possui uma conta, faça login.');
  })
  
});

//login



const { loginController } = require('./apps/authentication/controllers/authentication.controller');
const { getUserService } = require('./apps/global/services/getUser.service');
const { authenticateService } = require('./apps/authentication/services/authenticate.service');
const { generatorTokenJwtService } = require('./apps/authentication/services/generatorTokenJwt.service');
jest.mock('./apps/authentication/services/generatorTokenJwt.service');
jest.mock('./apps/authentication/services/authenticate.service');
jest.mock('./apps/global/services/getUser.service');
jest.mock('./apps/authentication/controllers/authentication.controller');
describe('loginController', () => {
  it('should return 400 if data is not valid', async () => {
    const req = { body: { /* dados inválidos */ } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });

  it('should return 400 if user does not exist', async () => {
    const req = { body: { email: 'nonexistent@example.com', password: 'password' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserService.mockResolvedValueOnce({ rowCount: 0 });

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou senha inválidos.' });
  });

  it('should return 400 if user is not active', async () => {
    const req = { body: { email: 'inactive@example.com', password: 'password' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserService.mockResolvedValueOnce({ rowCount: 1, rows: [{ active: false }] });

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Você não realizou a verificação de duas etapas.' });
  });

  it('should return 400 if password is invalid', async () => {
    const req = { body: { email: 'valid@example.com', password: 'invalidpassword' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserService.mockResolvedValueOnce({ rowCount: 1, rows: [{ active: true }] });
    authenticateService.mockResolvedValueOnce({ passwordIsValid: false });

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email ou senha inválidos.' });
  });

  it('should return user and token on successful login', async () => {
    const req = { body: { email: 'valid@example.com', password: 'validpassword' } };
    const res = { json: jest.fn() };

    const mockUser = { id: 1 /* outros dados do usuário */ };
    const mockToken = 'mockedToken';

    getUserService.mockResolvedValueOnce({ rowCount: 1, rows: [{ active: true }] });
    authenticateService.mockResolvedValueOnce({ rows: [mockUser], passwordIsValid: true });
    generatorTokenJwtService.mockReturnValueOnce(mockToken);

    await loginController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      user: { ...mockUser },
      token: mockToken,
    });
  });

  it('should return 500 on internal server error', async () => {
    const req = { body: { email: 'valid@example.com', password: 'validpassword' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    getUserService.mockRejectedValueOnce(new Error('Internal Server Error'));

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno do servidor. Tente novamente.' });
  });
});