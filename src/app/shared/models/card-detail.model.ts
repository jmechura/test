import { Transfer } from './transfer.model';
import { Card } from './card.model';

export interface CardDetailModel {
  accounts: CardDetailAccount[];
  card: Card;
}

interface CardDetailAccount {
  balance: number;
  transfers: Transfer[];
  type: string;
  uuid: string;
  name: string;
}
