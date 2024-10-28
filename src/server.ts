import { type IUserController } from './controllers/userController';
import { IRoomController } from './controllers/roomController';
import { MessageServer } from './messageServer';
import { RequestTypes } from './types/message.types';
import { Session } from './types/session.types';
import { IGameController } from './controllers/gameController';

export class Server {
  private messageServer: MessageServer<RequestTypes, Session>;

  constructor(
    userController: IUserController,
    roomController: IRoomController,
    gameController: IGameController
  ) {
    this.messageServer = new MessageServer<RequestTypes, Session>(3000);

    this.messageServer.use('reg', userController.register);

    this.messageServer.use('create_room', roomController.createRoom);
    this.messageServer.use('add_user_to_room', roomController.addUserToRoom);

    this.messageServer.use('add_ships', gameController.addShips);
    this.messageServer.use('attack', gameController.attack);
    this.messageServer.use('randomAttack', gameController.randomAttack);

    this.messageServer.on('userDisconnected', ({ user, ctx }) =>
      roomController.removeUserRooms(user, ctx)
    );
  }

  public async terminate() {
    return this.messageServer.terminate();
  }
}
