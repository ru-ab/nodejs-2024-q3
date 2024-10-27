import { UserController } from './controllers/userController.js';
import { RoomController } from './controllers/roomController.js';
import { httpServer } from './http_server/index.js';
import { Server } from './server';
import { RoomService } from './services/roomService.js';
import { UserService } from './services/userService.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const userService = new UserService();
const roomService = new RoomService();

const userController = new UserController(userService, roomService);
const roomController = new RoomController(roomService);

new Server(userController, roomController);
