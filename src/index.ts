import { GameController } from './controllers/gameController.js';
import { RoomController } from './controllers/roomController.js';
import { UserController } from './controllers/userController.js';
import { httpServer } from './http_server/index.js';
import { Server } from './server';
import { GameService } from './services/gameService.js';
import { RoomService } from './services/roomService.js';
import { UserService } from './services/userService.js';
import { WinnerService } from './services/winnerService.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const userService = new UserService();
const roomService = new RoomService();
const gameService = new GameService();
const winnerService = new WinnerService();

const userController = new UserController(
  userService,
  roomService,
  winnerService
);
const roomController = new RoomController(roomService, gameService);
const gameController = new GameController(
  gameService,
  winnerService,
  userService
);

const server = new Server(userController, roomController, gameController);

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, async () => {
    await server.terminate();
    console.log('Server is shut down.');
    process.exit();
  })
);
