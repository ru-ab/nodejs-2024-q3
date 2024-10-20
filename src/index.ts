import { App } from './app';
import { UserService } from './services/userService';
import { validateId } from './validators/validateId';
import { validateUserDto } from './validators/validateUserDto';

const port: number = Number(process.env.PORT || 4000);
const app = new App();

app.get('/api/users', async (req, res) => {
  const userService = new UserService();
  res.status(200).json(userService.getUsers());
});

app.get('/api/users/{userId}', async (req, res) => {
  const userId = validateId(req.params.userId);

  const userService = new UserService();
  const user = userService.getUser(userId);

  if (!user) {
    res.status(404).json({ message: `User ${userId} not found` });
    return;
  }

  res.status(200).json(user);
});

app.post('/api/users', async (req, res) => {
  const dto = validateUserDto(req.body);

  const userService = new UserService();
  const user = userService.createUser(dto);
  res.status(201).json(user);
});

app.put('/api/users/{userId}', async (req, res) => {
  const userId = validateId(req.params.userId);
  const dto = validateUserDto(req.body);

  const userService = new UserService();
  const user = userService.updateUser(userId, dto);

  if (!user) {
    res.status(404).json({ message: `User ${userId} not found` });
    return;
  }

  res.status(200).json(user);
});

app.delete('/api/users/{userId}', async (req, res) => {
  const userId = validateId(req.params.userId);

  const userService = new UserService();
  const user = userService.deleteUser(userId);

  if (!user) {
    res.status(404).json({ message: `User ${userId} not found` });
    return;
  }

  res.status(204).json();
});

app.listen(port);
