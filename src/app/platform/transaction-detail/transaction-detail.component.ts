import { Component } from '@angular/core';

@Component({
  selector: 'mss-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent {
  data = {
    basic: [
      {
        label: 'UUID',
        value: 'sadasdasd-asdasd4545d-asd54d45asdad'
      },
      {
        label: 'Terminal Date',
        value: new Date().toString()
      },
      {
        label: 'Server Date',
        value: new Date().toString()
      },
      {
        label: 'Transaction Type',
        value: 'PRE-AUTH'
      },
      {
        label: 'State',
        value: 'ACCEPTED'
      },
      {
        label: 'Response Code',
        value: '00'
      }
    ],
    issuer: [
      {
        label: 'Issuer',
        value: 'BANCIBO',
        clickable: true
      },
      {
        label: 'Card Group',
        value: 'BANCIBOCARDGROUP',
        clickable: true
      },
      {
        label: 'Card',
        value: 'GASTROCARD',
        clickable: true
      },
      {
        label: 'User',
        value: 'UserID123456',
        clickable: true
      }
    ],
    acquirer: [
      {
        label: 'Acquirer',
        value: 'SONET',
        clickable: true
      },
      {
        label: 'Merchant',
        value: 'SONMERCHANT',
        clickable: true
      },
      {
        label: 'Org Unit',
        value: 'Provozovna123abc',
        clickable: true
      },
      {
        label: 'Terminal',
        value: 'TER1234567',
        clickable: true
      }
    ],
    terminal: [
      {
        label: 'Something',
        value: 'Something'
      }
    ],
    amount: [
      {
        label: 'Amount',
        value: '640.25'
      },
      {
        label: 'Currency',
        value: 'CZK'
      }
    ],
    identification: [
      {
        label: 'Approval Code',
        value: '123456789'
      },
      {
        label: 'DST Stan ',
        value: new Date().toString()
      },
      {
        label: 'RRN',
        value: new Date().toString()
      },
      {
        label: 'Variable Symbol',
        value: 'abc123'
      },
      {
        label: 'Constant Symbol',
        value: 'abc123'
      }
    ],
    cardHolder: [
      {
        label: 'PAN',
        value: '123456****3456'
      },
      {
        label: 'Type of card',
        value: new Date().toString()
      }
    ]
  };

  goToDetail(item: any): void {
    // add routing
  }
}
