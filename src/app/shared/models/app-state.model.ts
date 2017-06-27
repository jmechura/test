import { StateModel } from './state.model';
import { AuthModel } from './auth.model';
import { Pagination } from './pagination.model';
import { Card } from './card.model';
import { AccountModel } from './account.model';
import { Transaction } from './transaction.model';
import { Ebank } from './ebank.model';
import { Transfer } from './transfer.model';
import { RoutingTable, TableRoutes } from './routin.model';
import { MerchantModel } from './merchant.model';

export interface AppState {
  transactionCodes: StateModel<string[]>;
  transactionStates: StateModel<string[]>;
  transactionTypes: StateModel<string[]>;
  transactions: StateModel<Transaction>;
  transactionEbank: StateModel<Ebank>;
  transactionTransfers: StateModel<Transfer[]>;
  card: StateModel<Pagination<Card>>;
  auth: StateModel<AuthModel>;
  account: StateModel<AccountModel>;
  merchants: StateModel<Pagination<MerchantModel>>;
  routingTable: StateModel<RoutingTable[]>;
  routes: StateModel<TableRoutes[]>;
  rules: StateModel<string[]>;
  targets: StateModel<string[]>;
}
