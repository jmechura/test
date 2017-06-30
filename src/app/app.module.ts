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
import { transactionCodeReducer } from './shared/reducers/transaction-code.reducer';
import { TransactionCodeEffect } from './shared/effects/transaction-code.effect';
import { transactionStateReducer } from './shared/reducers/transaction-state.reducer';
import { TransactionStateEffect } from './shared/effects/transaction-state.effect';
import { transactionTypeReducer } from './shared/reducers/transaction-type.reducer';
import { TransactionTypeEffect } from './shared/effects/transaction-type.effect';
import { transactionsReducer } from './shared/reducers/transactions.reducer';
import { TransactionsEffect } from './shared/effects/transactions.effect';
import { transactionEbankReducer } from './shared/reducers/transaction-ebank.reducer';
import { TransactionEbankEffect } from './shared/effects/transaction-ebank.effect';
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
import { transactionTransferReducer } from './shared/reducers/transaction-transfer.reducer';
import { TransactionTransferEffect } from './shared/effects/transaction-transfer.effect';
import { sequencesReducer } from './shared/reducers/sequences.reducer';
import { sequencesTypeReducer } from './shared/reducers/sequences-type.reducer';
import { SequencesTypeEffect } from 'app/shared/effects/sequences-type.effect';
import { SequencesEffect } from './shared/effects/sequenses.effect';
import { userResourceReducer } from './shared/reducers/user-resource.reducer';
import { UserResourceEffect } from './shared/effects/user-resource.effect';
import { IssuersEffect } from './shared/effects/issuer.effect';
import { issuersReducer } from './shared/reducers/issuer.reducer';
import { IssuerDetailEffect } from './shared/effects/issuer-detail.effect';
import { issuerDetailReducer } from 'app/shared/reducers/issuer-detail.reducer';
import { campaignsReducer } from './shared/reducers/campaign.reducer';
import { CampaignEffect } from './shared/effects/campaign.effect';
import { campaignFactoriesReducer } from './shared/reducers/campaign-factories.reducer';
import { CampaignFactoriesEffect } from './shared/effects/campaign-factories.effect';
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
import { singleTransactionReducer } from './shared/reducers/transaction.reducer';
import { TransactionEffect } from './shared/effects/transaction.effect';
import { cardStateReducer } from './shared/reducers/card-state.reducer';
import { CardStateEffect } from './shared/effects/card-state.effect';


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
      transactions: transactionsReducer,
      transactionEbank: transactionEbankReducer,
      transactionTransfers: transactionTransferReducer,
      transaction: singleTransactionReducer,
      merchants: merchantsReducer,
      issuers: issuersReducer,
      issuerDetail: issuerDetailReducer,
      routingTable: routingTableReducer,
      routes: routesReducer,
      targets: targetReducer,
      rules: ruleReducer,
      sequences: sequencesReducer,
      sequencesType: sequencesTypeReducer,
      userResource: userResourceReducer,
      campaigns: campaignsReducer,
      campaignFactories: campaignFactoriesReducer,
      issuerCodes: issuerCodeReducer,
      networkCodes: networkCodeReducer,
      merchantCodes: merchantCodeReducer,
      orgUnitCodes: orgUnitCodeReducer,
      cardGroupCodes: cardGroupCodeReducer,
      cardStates: cardStateReducer
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
    EffectsModule.runAfterBootstrap(TransactionEffect),
    EffectsModule.runAfterBootstrap(RoutingTableEffect),
    EffectsModule.runAfterBootstrap(RoutesEffect),
    EffectsModule.runAfterBootstrap(TargetEffect),
    EffectsModule.runAfterBootstrap(RuleEffect),
    EffectsModule.runAfterBootstrap(MerchantsEffect),
    EffectsModule.runAfterBootstrap(IssuersEffect),
    EffectsModule.runAfterBootstrap(IssuerDetailEffect),
    EffectsModule.runAfterBootstrap(CampaignEffect),
    EffectsModule.runAfterBootstrap(CampaignFactoriesEffect),
    EffectsModule.runAfterBootstrap(IssuerCodeEffect),
    EffectsModule.runAfterBootstrap(NetworkCodeEffect),
    EffectsModule.runAfterBootstrap(MerchantCodeEffect),
    EffectsModule.runAfterBootstrap(OrgUnitCodeEffect),
    EffectsModule.runAfterBootstrap(CardGroupCodeEffect),
    EffectsModule.runAfterBootstrap(SequencesEffect),
    EffectsModule.runAfterBootstrap(SequencesTypeEffect),
    EffectsModule.runAfterBootstrap(UserResourceEffect),
    EffectsModule.runAfterBootstrap(CardStateEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [
    ApiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
