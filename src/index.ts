import { App } from './app';
import { UserService } from './services/userService';
import { validateUserDto } from './validators/validateUserDto';

const PORT = 3000;
const app = new App();

app.get('/api/users', async (req, res) => {
  const userService = new UserService();
  res.status(200).json(userService.getUsers());
});

app.post('/api/users', async (req, res) => {
  const dto = validateUserDto(req.body);

  const userService = new UserService();
  const user = userService.createUser(dto);
  res.status(201).json(user);
});

app.listen(PORT);
