import { StateModel } from './state.model';
import { AuthModel } from './auth.model';
import { AccountModel } from './account.model';

export interface AppState {
  auth: StateModel<AuthModel>;
  account: StateModel<AccountModel>;
}
