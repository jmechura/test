import { StateModel } from './state.model';
import { AuthModel } from './auth.model';
import { Transaction } from './transaction.model';
import { Ebank } from './ebank.model';
import { Transfer } from './transfer.model';
import { AccountModel } from './account.model';

export interface AppState {
  transactionCodes: StateModel<string[]>;
  transactionStates: StateModel<string[]>;
  transactionTypes: StateModel<string[]>;
  transactions: StateModel<Transaction>;
  transactionEbank: StateModel<Ebank>;
  transactionTransfers: StateModel<Transfer[]>;
  auth: StateModel<AuthModel>;
  account: StateModel<AccountModel>;
}
