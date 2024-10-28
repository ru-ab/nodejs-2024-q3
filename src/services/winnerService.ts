import { Context } from '../messageServer';
import { UpdateWinnersResponse } from '../types/message.types';
import { Session } from '../types/session.types';
import { Winner } from '../types/winner.types';

export interface IWinnerService {
  updateWinner: (name: string) => void;
  broadcastUpdateWinnersMessage: (ctx: Context<Session>) => void;
}

export class WinnerService implements IWinnerService {
  private winners: Winner[] = [];

  public updateWinner(name: string): void {
    const winner = this.winners.find((winner) => winner.name === name);
    if (!winner) {
      this.winners.push({
        name,
        wins: 1,
      });
    } else {
      winner.wins += 1;
    }

    this.winners.sort((a, b) => b.wins - a.wins);
  }

  public broadcastUpdateWinnersMessage(ctx: Context<Session>): void {
    const updateWinnerMessage: UpdateWinnersResponse = {
      id: 0,
      type: 'update_winners',
      data: this.winners,
    };

    ctx.broadcast(updateWinnerMessage);

    console.log(`Broadcast command: "update_winners" with list of winners.`);
  }
}
