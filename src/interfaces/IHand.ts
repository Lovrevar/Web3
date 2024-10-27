import type { ICard } from './IDeck';
import type { IPlayerHand } from './IPlayerHand';
export interface IHand {
  player:IPlayerHand,
  play(card: ICard, chosenColor?: string): boolean;
  endTurn(): void;
  getTopCard(): ICard;
  drawCard(): void;
}
