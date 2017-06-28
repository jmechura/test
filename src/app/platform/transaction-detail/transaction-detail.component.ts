import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { singleTransactionActions } from '../../shared/reducers/transaction.reducer';
import { StateModel } from '../../shared/models/state.model';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'mss-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent {


  private unsubscribe$ = new Subject<void>();
  transaction: Transaction;
  displayData: any;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    this.route.params.takeUntil(this.unsubscribe$).subscribe(
      (data: { uuid: string, termDttm: string }) => {
        this.store.dispatch({type: singleTransactionActions.TRANSACTION_GET_REQUEST, payload: data});
      }
    );
    this.store.select('transaction').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<Transaction>) => {
        if (data.error) {
          console.error('Error while getting transaction detail', data.error);
        }
        if (!data.loading) {
          this.transaction = data.data;
          this.displayData = this.createSelection(this.transaction);

        }
      }
    );
  }

  goToDetail(item: any): void {
    // add routing
  }

  createSelection(transaction: Transaction): any {
    return {
      basic: [
        {
          label: 'UUID',
          value: transaction.uuid
        },
        {
          label: 'Terminal Date',
          value: transaction.termDttm
        },
        {
          label: 'Server Date',
          value: new Date().toString()
        },
        {
          label: 'Transaction Type',
          value: transaction.transactionType
        },
        {
          label: 'State',
          value: transaction.state
        },
        {
          label: 'Response Code',
          value: transaction.responseCode
        }
      ],
      issuer: [
        {
          label: 'Issuer',
          value: transaction.issuerCode,
          clickable: true
        },
        {
          label: 'Card Group',
          value: transaction.cardGroupCode,
          clickable: true
        },
        {
          label: 'Card',
          value: 'Dont know where to get it',
          clickable: true
        },
        {
          label: 'User',
          value: 'Dont know where to get it',
          clickable: true
        }
      ],
      acquirer: [
        {
          label: 'Acquirer',
          value: 'Dont know where to get it',
          clickable: true
        },
        {
          label: 'Merchant',
          value: transaction.merchantCode,
          clickable: true
        },
        {
          label: 'Org Unit',
          value: transaction.orgUnitCode,
          clickable: true
        },
        {
          label: 'Terminal',
          value: transaction.terminalCode,
          clickable: true
        }
      ],
      terminal: [
        {
          label: 'Something',
          value: 'Dont know where to get it'
        }
      ],
      amount: [
        {
          label: 'Amount',
          value: transaction.amount
        },
        {
          label: 'Currency',
          value: 'Dont know where to get it'
        }
      ],
      identification: [
        {
          label: 'Approval Code',
          value: transaction.approvalCode
        },
        {
          label: 'DST Stan ',
          value: transaction.dstStan
        },
        {
          label: 'RRN',
          value: transaction.rrn
        },
        {
          label: 'Variable Symbol',
          value: transaction.vs
        },
        {
          label: 'Constant Symbol',
          value: 'Dont know where to  get it'
        }
      ],
      cardHolder: [
        {
          label: 'PAN',
          value: 'Dont know where to get it'
        },
        {
          label: 'Type of card',
          value: 'Dont know where to get it'
        }
      ]
    };
  }
}
