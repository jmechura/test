import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { singleTransactionActions } from '../../shared/reducers/transaction.reducer';
import { StateModel } from '../../shared/models/state.model';
import { Transaction } from '../../shared/models/transaction.model';
import { TransactionDetailSection } from '../../shared/enums/transaction-detail-section.enum';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { transactionTransferActions } from '../../shared/reducers/transaction-transfer.reducer';
import { transactionEbankActions } from '../../shared/reducers/transaction-ebank.reducer';
import { Transfer } from '../../shared/models/transfer.model';
import { Ebank } from '../../shared/models/ebank.model';
import { UnsubscribeSubject } from '../../shared/utils';
import { LanguageService } from '../../shared/language/language.service';

@Component({
  selector: 'mss-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnDestroy {


  private unsubscribe$ = new UnsubscribeSubject();
  transaction: Transaction;
  sections: SelectItem[] = [];
  visibleSection: SelectItem;
  TransactionDetailSection = TransactionDetailSection;
  transfers: Transfer[] = [];
  ebank: Ebank;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private language: LanguageService,
              private store: Store<AppStateModel>) {
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (data: { uuid: string, termDttm: string }) => {
        this.store.dispatch({type: singleTransactionActions.TRANSACTION_GET_REQUEST, payload: data});
        this.store.dispatch({type: transactionTransferActions.TRANSACTION_TRANSFERS_GET_REQUEST, payload: data});
        this.store.dispatch({type: transactionEbankActions.TRANSACTION_EBANK_GET_REQUEST, payload: data});
      }
    );
    this.store.select('transaction').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Transaction>) => {
        if (data.error) {
          console.error('Error while getting transaction detail', data.error);
        }
        if (data.data !== undefined && !data.loading) {
          this.transaction = data.data;
        }
      }
    );

    this.store.select('transactionTransfers').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Transfer[]>) => {
        if (data.error) {
          console.error('Error while getting transaction transfers.', data.error);
        }
        if (data.data !== undefined && !data.loading) {
          this.transfers = data.data;
        }
      }
    );

    this.store.select('transactionEbank').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Ebank>) => {
        if (data.error) {
          console.error('Error while getting transaction ebank.', data.error);
        }
        if (data.data !== undefined && !data.loading) {
          this.ebank = data.data;
        }
      }
    );

    this.sections = Object.keys(TransactionDetailSection).filter(key => isNaN(Number(key)))
      .map(item => ({
        label: this.language.translate(`transactions.detail.sections.${item}`),
        value: TransactionDetailSection[item]
      }));
    this.visibleSection = this.sections[0];
  }

  goToDetail(section: string, item: any): void {
    let validSection;
    switch (section) {
      case 'issuer':
        validSection = 'issuers';
        break;
      case 'cardGroup':
        validSection = 'card-groups';
        break;
      case 'card':
        validSection = 'employer-card';
        break;
      case 'user':
        break;
      case 'acquirer':
        break;
      case 'merchant':
        break;
      case 'orgUnit':
        break;
      case 'terminal':
        break;
      default:
    }
    if (validSection) {
      this.router.navigateByUrl(`platform/${validSection}/${item}`);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

}
