import { RegisterController } from './controllers/registerController.js';
import { httpServer } from './http_server/index.js';
import { Server } from './server';
import { UserService } from './services/userService.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const userService = new UserService();
const registerController = new RegisterController(userService);
new Server(registerController);
