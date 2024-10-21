import request from 'supertest';
import server from '../../index';

describe('/api/users scenario 1', () => {
  const validUserDto = {
    username: 'User',
    age: 25,
    hobbies: ['Cooking', 'Music'],
  };

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    server.close();
  });

  it('should correctly create and delete user', async () => {
    // no users
    let res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);

    // create new user
    res = await request(server)
      .post('/api/users')
      .send(validUserDto)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);

    // get users
    res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body[0].username).toEqual(validUserDto.username);
    expect(res.body[0].age).toEqual(validUserDto.age);
    expect(res.body[0].hobbies).toEqual(validUserDto.hobbies);

    // delete user
    res = await request(server).delete(`/api/users/${res.body[0].id}`);
    expect(res.status).toBe(204);

    // no users
    res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
