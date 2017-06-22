import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BronzeComponentsModule } from './shared/components/bronze/bronze-components.module';
import { SilverComponentsModule } from 'app/shared/components/silver/silver-components.module';
import { GoldComponentsModule } from './shared/components/gold/gold-components.module';
import { LoginModule } from './login/login.module';
import { PlatformModule } from './platform/platform.module';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './shared/reducers/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffect } from './shared/effects/auth.effect';
import { ApiService } from './shared/services/api.service';
import { cardReducer } from './shared/reducers/card.reducer';
import { CardEffect } from './shared/effects/card.effect';
import { accountReducer } from './shared/reducers/account.reducer';
import { AccountEffect } from './shared/effects/account.effect';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { transactionCodeReducer } from './shared/reducers/transactionCode.reducer';
import { TransactionCodeEffect } from './shared/effects/transactionCode.effect';
import { transactionStateReducer } from './shared/reducers/transactionState.reducer';
import { TransactionStateEffect } from './shared/effects/transactionState.effect';
import { transactionTypeReducer } from './shared/reducers/transactionType.reducer';
import { TransactionTypeEffect } from './shared/effects/transactionType.effect';
import { transactionReducer } from './shared/reducers/transaction.reducer';
import { TransactionsEffect } from './shared/effects/transaction.effect';
import { transactionEbankReducer } from './shared/reducers/transactionEbank.reducer';
import { TransactionEbankEffect } from './shared/effects/transactionEbank.effect';
import { transactionTransferReducer } from './shared/reducers/transactionTransfer.reducer';
import { TransactionTransferEffect } from './shared/effects/transactionTransfer.effect';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    PlatformModule,
    LoginModule,

    BronzeComponentsModule,
    SilverComponentsModule,
    GoldComponentsModule,
    StoreModule.provideStore({
      auth: authReducer,
      card: cardReducer,
      account: accountReducer,
      transactionCodes: transactionCodeReducer,
      transactionStates: transactionStateReducer,
      transactionTypes: transactionTypeReducer,
      transactions: transactionReducer,
      transactionEbank: transactionEbankReducer,
      transactionTransfers: transactionTransferReducer
    }),
    EffectsModule.runAfterBootstrap(AuthEffect),
    EffectsModule.runAfterBootstrap(CardEffect),
    EffectsModule.runAfterBootstrap(AccountEffect),
    EffectsModule.runAfterBootstrap(AuthEffect),
    EffectsModule.runAfterBootstrap(TransactionCodeEffect),
    EffectsModule.runAfterBootstrap(TransactionStateEffect),
    EffectsModule.runAfterBootstrap(TransactionTypeEffect),
    EffectsModule.runAfterBootstrap(TransactionsEffect),
    EffectsModule.runAfterBootstrap(TransactionEbankEffect),
    EffectsModule.runAfterBootstrap(TransactionTransferEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    ApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
