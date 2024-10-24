import request from 'supertest';
import server from '../../index';

describe('/api/users scenario 3', () => {
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

  it('should correctly create, update and delete user', async () => {
    // Get all records with a GET api/users request (an empty array is expected)
    let res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);

    // A new object is created by a POST api/users request (a response containing newly created record is expected)
    res = await request(server)
      .post('/api/users')
      .send(validUserDto)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.username).toEqual(validUserDto.username);
    expect(res.body.age).toEqual(validUserDto.age);
    expect(res.body.hobbies).toEqual(validUserDto.hobbies);

    // With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)
    const user = res.body;
    res = await request(server).get(`/api/users/${user.id}`);
    expect(res.status).toBe(200);
    expect(user).toEqual(user);

    // We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)
    const updatedUserDto = {
      username: 'New username',
      age: 30,
      hobbies: ['Cycling'],
    };
    res = await request(server)
      .put(`/api/users/${user.id}`)
      .send(updatedUserDto)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(updatedUserDto.username);
    expect(res.body.age).toEqual(updatedUserDto.age);
    expect(res.body.hobbies).toEqual(updatedUserDto.hobbies);

    // With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
    res = await request(server).delete(`/api/users/${user.id}`);
    expect(res.status).toBe(204);

    // With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
    res = await request(server).get(`/api/users/${user.id}`);
    expect(res.status).toBe(404);
  });
});
