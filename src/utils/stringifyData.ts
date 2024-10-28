import { Message } from '../messageServer';

export function stringifyData(data: Message): string {
  return JSON.stringify({
    ...(data as Message),
    data: JSON.stringify((data as Message).data),
  });
}
