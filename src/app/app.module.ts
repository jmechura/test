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
import { TransactionCodeEffect } from './shared/effects/transaction-code.effect';
import { transactionStateReducer } from './shared/reducers/transactionState.reducer';
import { TransactionStateEffect } from './shared/effects/transaction-state.effect';
import { transactionTypeReducer } from './shared/reducers/transactionType.reducer';
import { TransactionTypeEffect } from './shared/effects/transaction-type.effect';
import { transactionReducer } from './shared/reducers/transaction.reducer';
import { TransactionsEffect } from './shared/effects/transaction.effect';
import { transactionEbankReducer } from './shared/reducers/transactionEbank.reducer';
import { TransactionEbankEffect } from './shared/effects/transaction-ebank.effect';
import { transactionTransferReducer } from './shared/reducers/transactionTransfer.reducer';
import { RoutingTableEffect } from './shared/effects/routing-table.effect';
import { routingTableReducer } from './shared/reducers/routing-table.reducer';
import { targetReducer } from './shared/reducers/targer.reducer';
import { TargetEffect } from './shared/effects/target.effect';
import { RuleEffect } from './shared/effects/rule.effect';
import { ruleReducer } from './shared/reducers/rule.reducer';
import { routesReducer } from './shared/reducers/routes.reducer';
import { RoutesEffect } from './shared/effects/routes.effect';
import { merchantsReducer } from './shared/reducers/merchant.reducer';
import { MerchantsEffect } from './shared/effects/merchant.effect';
import { TransactionTransferEffect } from './shared/effects/transaction-transfer.effect';
import { issuerCodeReducer } from './shared/reducers/issuer-code.reducer';
import { IssuerCodeEffect } from './shared/effects/issuer-code.effect';
import { networkCodeReducer } from './shared/reducers/network-code.reducer';
import { NetworkCodeEffect } from './shared/effects/network-code.effect';
import { merchantCodeReducer } from './shared/reducers/merchant-code.reducer';
import { MerchantCodeEffect } from './shared/effects/merchant-code.effect';
import { orgUnitCodeReducer } from './shared/reducers/org-unit-code.reducer';
import { OrgUnitCodeEffect } from './shared/effects/org-unit-code.effect';
import { cardGroupCodeReducer } from './shared/reducers/card-group-code.reducer';
import { CardGroupCodeEffect } from './shared/effects/card-group-code.effect';


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
      transactionTransfers: transactionTransferReducer,
      merchants: merchantsReducer,
      routingTable: routingTableReducer,
      routes: routesReducer,
      targets: targetReducer,
      rules: ruleReducer,
      issuerCodes: issuerCodeReducer,
      networkCodes: networkCodeReducer,
      merchantCodes: merchantCodeReducer,
      orgUnitCodes: orgUnitCodeReducer,
      cardGroupCodes: cardGroupCodeReducer
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
    EffectsModule.runAfterBootstrap(RoutingTableEffect),
    EffectsModule.runAfterBootstrap(RoutesEffect),
    EffectsModule.runAfterBootstrap(TargetEffect),
    EffectsModule.runAfterBootstrap(RuleEffect),
    EffectsModule.runAfterBootstrap(MerchantsEffect),
    EffectsModule.runAfterBootstrap(IssuerCodeEffect),
    EffectsModule.runAfterBootstrap(NetworkCodeEffect),
    EffectsModule.runAfterBootstrap(MerchantCodeEffect),
    EffectsModule.runAfterBootstrap(OrgUnitCodeEffect),
    EffectsModule.runAfterBootstrap(CardGroupCodeEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    ApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
