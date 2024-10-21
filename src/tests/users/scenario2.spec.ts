import request from 'supertest';
import server from '../../index';

describe('/api/users scenario 2', () => {
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

  it.each([
    { age: validUserDto.age, hobbies: validUserDto.hobbies },
    { username: validUserDto.username, hobbies: validUserDto.hobbies },
    { username: validUserDto.username, age: validUserDto.age },
    { ...validUserDto, username: 1 },
    { ...validUserDto, age: true },
    { ...validUserDto, hobbies: 'Cooking' },
    { ...validUserDto, hobbies: ['Cooking', 12] },
  ])('should validate user dto', async (dto) => {
    const res = await request(server)
      .post('/api/users')
      .send(dto)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
  });

  it('should validate id', async () => {
    const invalidId = 'invalidId';
    const res = await request(server).get(`/api/users/${invalidId}`);
    expect(res.status).toBe(400);
  });
});
