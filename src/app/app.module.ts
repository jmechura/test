import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BronzeComponentsModule } from './shared/components/bronze/bronze-components.module';
import { SilverComponentsModule } from 'app/shared/components/silver/silver-components.module';
import { GoldComponentsModule } from './shared/components/gold/gold-components.module';
import { LoginModule } from './login/login.module';
import { PlatformModule } from './platform/platform.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ApiService } from './shared/services/api.service';
import { cardReducer } from './shared/reducers/card.reducer';
import { CardEffect } from './shared/effects/card.effect';
import { profileReducer } from './shared/reducers/profile.reducer';
import { ProfileEffect } from './shared/effects/profile.effect';
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
import { merchantsDetailReducer } from './shared/reducers/merchant-detail.reducer';
import { MerchantsDetailEffect } from './shared/effects/merchant-detail.effect';
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
import { terminalReducer } from './shared/reducers/terminal.reducer';
import { TerminalEffect } from './shared/effects/terminal.effect';
import { cardRequestReducer } from './shared/reducers/card-request.reducer';
import { CardRequestEffect } from './shared/effects/card-request.effect';
import { cardRequestStateReducer } from './shared/reducers/card-request-state.reducer';
import { CardRequestStateEffect } from './shared/effects/card-request-state.effect';
import { cardDetailReducer } from './shared/reducers/card-detail.reducer';
import { CardDetailEffect } from './shared/effects/card-detail.effect';
import { TemplatesEffect } from 'app/shared/effects/templates.effect';
import { templatesReducer } from './shared/reducers/template.reducer';
import { userAuthorityReducer } from './shared/reducers/user-authorities.reducer';
import { UserAuthoritiesEffect } from './shared/effects/user-authority.effect';
import { cardGroupReducer } from './shared/reducers/card-group.reducer';
import { CardGroupEffect } from './shared/effects/card-group.effect';
import { cardGroupDetailReducer } from './shared/reducers/card-group-detail.reducer';
import { CardGroupDetailEffect } from './shared/effects/card-group-detail.effect';
import { taxTypesReducer } from './shared/reducers/tax-types.reducer';
import { TaxTypesEffect } from './shared/effects/tax-types.effect';
import { OrgUnitListEffect } from './shared/effects/org-unit-list.effect';
import { orgUnitListReducer } from './shared/reducers/org-unit-list.reducer';
import { orgUnitReducer } from './shared/reducers/org-unit.reducer';
import { OrgUnitEffect } from './shared/effects/org-unit.effect';
import { systemReducer } from './shared/reducers/system.reducer';
import { SystemsEffect } from './shared/effects/system.effect';
import { campaignDetailReducer } from './shared/reducers/campaign-detail.reducer';
import { CampaignDetailEffect } from './shared/effects/campaign-detail.effect';
import { campaignPropertyDefReducer } from './shared/reducers/campaign-property-def.reducer';
import { CampaignPropertyDefEffect } from './shared/effects/campaign-property-def.effect';
import { campaignPropertyReducer } from './shared/reducers/campaign-property.reducer';
import { CampaignPropertyEffect } from './shared/effects/campaign-property.effect';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { userListReducer } from './shared/reducers/user-list.reducer';
import { UserListEffect } from './shared/effects/user-list.effect';
import { userReducer } from './shared/reducers/user.reducer';
import { UserEffect } from './shared/effects/user.effect';
import { importsReducer } from './shared/reducers/imports.reducer';
import { ImportsEffect } from './shared/effects/imports.effect';
import { ImportTypeEffect } from './shared/effects/import-type.effect';
import { importTypeReducer } from './shared/reducers/import-type.reducer';
import { importDetailReducer } from './shared/reducers/import-detail.reducer';
import { ImportDetailEffect } from './shared/effects/import-detail.effect';
import { importPropertyDefReducer } from './shared/reducers/import-property-def.reducer';
import { ImportPropertyDefEffect } from './shared/effects/import-property-def.effect';
import { importPropertyReducer } from './shared/reducers/import-property.reducer';
import { ImportPropertyEffect } from './shared/effects/import-property.effect';
import { AdminReportsEffect } from './shared/effects/admin-reports.effect';
import { adminReportsReducer } from './shared/reducers/admin-reports.reducer';
import { reportTypeReducer } from './shared/reducers/report-types.reducer';
import { ReportTypesEffect } from './shared/effects/report-types.effect';
import { reportDetailReducer } from './shared/reducers/report-detail.reducer';
import { ReportDetailEffect } from './shared/effects/report-detail.effect';
import { reportPropertyReducer } from './shared/reducers/report-property.reducer';
import { ReportPropertyEffect } from './shared/effects/report-property.effect';
import { reportPropertyDefReducer } from './shared/reducers/report-property-def.reducer';
import { ReportPropertyDefEffect } from './shared/effects/report-property-def.effect';
import { AppConfigService } from './shared/services/app-config.service';
import { acquirersReducer } from './shared/reducers/acquirers.reducer';
import { AcquirersEffect } from './shared/effects/acquirers.effect';
import { acquirerDetailReducer } from './shared/reducers/acquirer-detail.reducer';
import { AcquirerDetailEffect } from './shared/effects/acquirer-detail.effect';
import { acquirerKeysReducer } from './shared/reducers/acquirer-key.reducer';
import { AcquirerKeysEffect } from './shared/effects/acquirer-keys.effect';
import { countryCodeReducer } from './shared/reducers/country-code.reducer';
import { CountryCodeEffect } from './shared/effects/country-code.effect';
import { LanguageService } from './shared/services/language.service';
import { RoleService } from './shared/services/role.service';
import { terminalDetailReducer } from './shared/reducers/terminal-detail.reducer';
import { TerminalDetailEffect } from './shared/effects/terminal-detail.effect';
import { reportsReducer } from './shared/reducers/reports.reducer';
import { ReportsEffect } from './shared/effects/reports.effect';
import { templateDetailReducer } from './shared/reducers/template-detail.reducer';
import { TemplateDetailEffect } from './shared/effects/template-detail.effect';
import { configurationTypeReducer } from './shared/reducers/configuration-type.reducer';
import { ConfigurationTypeEffect } from './shared/effects/configuration-type.effect';
import { configurationReducer } from './shared/reducers/configuration.reducer';
import { ConfigurationEffect } from './shared/effects/configuration.effect';
import { configurationInstanceReducer } from './shared/reducers/configuration-instance.reducer';
import { ConfigurationInstanceEffect } from './shared/effects/configuration-instance.effect';
import { templatesSimpleReducer } from './shared/reducers/template-simple.reducer';
import { TemplatesSimpleEffect } from './shared/effects/template-simple.effect';
import { transfersReducer } from './shared/reducers/transfers.reducer';
import { TransferEffect } from './shared/effects/transfers.effect';
import { routingTableDetailReducer } from './shared/reducers/routing-table-detail.reducer';
import { RoutingTableDetailEffect } from 'app/shared/effects/routing-table-detail.effect';
import { importCodeReducer } from './shared/reducers/import-code.reducer';
import { ImportCodeEffect } from './shared/effects/import-code.effect';

export function createTranslateLoader(http: Http): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/languages/', '.json');
}

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
      card: cardReducer,
      transfers: transfersReducer,
      profile: profileReducer,
      templates: templatesReducer,
      transactionCodes: transactionCodeReducer,
      transactionStates: transactionStateReducer,
      transactionTypes: transactionTypeReducer,
      transactions: transactionsReducer,
      transactionEbank: transactionEbankReducer,
      transactionTransfers: transactionTransferReducer,
      transaction: singleTransactionReducer,
      merchants: merchantsReducer,
      merchantsDetail: merchantsDetailReducer,
      issuers: issuersReducer,
      issuerDetail: issuerDetailReducer,
      routingTable: routingTableReducer,
      routingTableDetail: routingTableDetailReducer,
      routes: routesReducer,
      targets: targetReducer,
      rules: ruleReducer,
      systems: systemReducer,
      sequences: sequencesReducer,
      sequencesType: sequencesTypeReducer,
      userResource: userResourceReducer,
      orgUnitList: orgUnitListReducer,
      orgUnit: orgUnitReducer,
      userAuthority: userAuthorityReducer,
      campaigns: campaignsReducer,
      campaignFactories: campaignFactoriesReducer,
      campaignDetail: campaignDetailReducer,
      issuerCodes: issuerCodeReducer,
      networkCodes: networkCodeReducer,
      merchantCodes: merchantCodeReducer,
      orgUnitCodes: orgUnitCodeReducer,
      cardGroupCodes: cardGroupCodeReducer,
      terminal: terminalReducer,
      terminalDetail: terminalDetailReducer,
      cardStates: cardStateReducer,
      cardRequests: cardRequestReducer,
      cardRequestStates: cardRequestStateReducer,
      cardDetail: cardDetailReducer,
      cardGroups: cardGroupReducer,
      cardGroupDetail: cardGroupDetailReducer,
      taxTypes: taxTypesReducer,
      campaignPropertyDefs: campaignPropertyDefReducer,
      campaignProperties: campaignPropertyReducer,
      imports: importsReducer,
      importTypes: importTypeReducer,
      importDetail: importDetailReducer,
      importCodes: importCodeReducer,
      importPropertyDefs: importPropertyDefReducer,
      importProperties: importPropertyReducer,
      userList: userListReducer,
      user: userReducer,
      acquirers: acquirersReducer,
      acquirerDetail: acquirerDetailReducer,
      acquirerKeys: acquirerKeysReducer,
      adminReports: adminReportsReducer,
      reportTypes: reportTypeReducer,
      reportDetail: reportDetailReducer,
      reportProperties: reportPropertyReducer,
      reportPropertyDefs: reportPropertyDefReducer,
      countryCodes: countryCodeReducer,
      reports: reportsReducer,
      templateDetail: templateDetailReducer,
      configurationTypes: configurationTypeReducer,
      configurations: configurationReducer,
      configurationInstances: configurationInstanceReducer,
      templatesSimple: templatesSimpleReducer,
    }),
    EffectsModule.runAfterBootstrap(CardEffect),
    EffectsModule.runAfterBootstrap(TransferEffect),
    EffectsModule.runAfterBootstrap(ProfileEffect),
    EffectsModule.runAfterBootstrap(TransactionCodeEffect),
    EffectsModule.runAfterBootstrap(TransactionStateEffect),
    EffectsModule.runAfterBootstrap(TransactionTypeEffect),
    EffectsModule.runAfterBootstrap(TransactionsEffect),
    EffectsModule.runAfterBootstrap(TransactionEbankEffect),
    EffectsModule.runAfterBootstrap(TransactionTransferEffect),
    EffectsModule.runAfterBootstrap(TransactionEffect),
    EffectsModule.runAfterBootstrap(RoutingTableEffect),
    EffectsModule.runAfterBootstrap(RoutingTableDetailEffect),
    EffectsModule.runAfterBootstrap(RoutesEffect),
    EffectsModule.runAfterBootstrap(TargetEffect),
    EffectsModule.runAfterBootstrap(RuleEffect),
    EffectsModule.runAfterBootstrap(MerchantsEffect),
    EffectsModule.runAfterBootstrap(MerchantsDetailEffect),
    EffectsModule.runAfterBootstrap(OrgUnitListEffect),
    EffectsModule.runAfterBootstrap(OrgUnitEffect),
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
    EffectsModule.runAfterBootstrap(TerminalEffect),
    EffectsModule.runAfterBootstrap(TerminalDetailEffect),
    EffectsModule.runAfterBootstrap(UserAuthoritiesEffect),
    EffectsModule.runAfterBootstrap(CardStateEffect),
    EffectsModule.runAfterBootstrap(CardRequestEffect),
    EffectsModule.runAfterBootstrap(CardRequestStateEffect),
    EffectsModule.runAfterBootstrap(CardDetailEffect),
    EffectsModule.runAfterBootstrap(CardGroupEffect),
    EffectsModule.runAfterBootstrap(CardGroupDetailEffect),
    EffectsModule.runAfterBootstrap(TaxTypesEffect),
    EffectsModule.runAfterBootstrap(TemplatesEffect),
    EffectsModule.runAfterBootstrap(SystemsEffect),
    EffectsModule.runAfterBootstrap(CampaignDetailEffect),
    EffectsModule.runAfterBootstrap(CampaignPropertyDefEffect),
    EffectsModule.runAfterBootstrap(CampaignPropertyEffect),
    EffectsModule.runAfterBootstrap(ImportsEffect),
    EffectsModule.runAfterBootstrap(ImportTypeEffect),
    EffectsModule.runAfterBootstrap(ImportDetailEffect),
    EffectsModule.runAfterBootstrap(ImportCodeEffect),
    EffectsModule.runAfterBootstrap(ImportPropertyDefEffect),
    EffectsModule.runAfterBootstrap(ImportPropertyEffect),
    EffectsModule.runAfterBootstrap(UserListEffect),
    EffectsModule.runAfterBootstrap(UserEffect),
    EffectsModule.runAfterBootstrap(AdminReportsEffect),
    EffectsModule.runAfterBootstrap(ReportTypesEffect),
    EffectsModule.runAfterBootstrap(ReportDetailEffect),
    EffectsModule.runAfterBootstrap(ReportPropertyEffect),
    EffectsModule.runAfterBootstrap(ReportPropertyDefEffect),
    EffectsModule.runAfterBootstrap(AcquirersEffect),
    EffectsModule.runAfterBootstrap(AcquirerDetailEffect),
    EffectsModule.runAfterBootstrap(AcquirerKeysEffect),
    EffectsModule.runAfterBootstrap(CountryCodeEffect),
    EffectsModule.runAfterBootstrap(ReportsEffect),
    EffectsModule.runAfterBootstrap(TemplateDetailEffect),
    EffectsModule.runAfterBootstrap(ConfigurationTypeEffect),
    EffectsModule.runAfterBootstrap(ConfigurationEffect),
    EffectsModule.runAfterBootstrap(ConfigurationInstanceEffect),
    EffectsModule.runAfterBootstrap(TemplatesSimpleEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      },
    }),
  ],
  providers: [
    ApiService,
    LanguageService,
    AppConfigService,
    RoleService,
    {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
