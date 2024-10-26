import { SendResponse } from '../messageServer';
import { IUserService } from '../services/userService';
import {
  RegisterRequest,
  RegisterResponse,
  RegisterResponseData,
} from '../types/message.types';

export interface IRegisterController {
  register: (req: RegisterRequest, res: SendResponse) => void;
}

export class RegisterController implements IRegisterController {
  constructor(private readonly userService: IUserService) {}

  register = (req: RegisterRequest, res: SendResponse) => {
    function createResponse(data: RegisterResponseData): RegisterResponse {
      return {
        id: 0,
        type: 'reg',
        data,
      };
    }

    const { name, password } = req.data;

    let user = this.userService.getUserByName(name);
    if (!user) {
      user = this.userService.createUser(name, password);
    }

    if (!this.userService.isPasswordValid(name, password)) {
      return res(
        createResponse({
          index: 0,
          name: '',
          error: true,
          errorText: 'Invalid password',
        })
      );
    }

    return res(
      createResponse({
        index: user.id,
        name: user.name,
        error: false,
        errorText: '',
      })
    );
  };
}
