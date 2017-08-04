import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncryptPinBlockService, IEncryptedPinBlock, IEncryptPinBlockModel } from '../../shared/services/crypto-service';
import { AppStateModel } from '../../shared/models/app-state.model';
import { Store } from '@ngrx/store';
import { MissingTokenResponse, UnsubscribeSubject } from '../../shared/utils';
import { StateModel } from '../../shared/models/state.model';
import { CardDetailModel } from '../../shared/models/card-detail.model';
import { ProfileModel } from '../../shared/models/profile.model';
import { cardDetailActions } from '../../shared/reducers/card-detail.reducer';
import { ApiService } from '../../shared/services/api.service';
import { ExtendedToastrService } from '../../shared/services/extended-toastr.service';

interface PinblocKeyModel {
  alg: string;
  e: string;
  ext: boolean;
  key_ops: string[];
  kty: string;
  n: string;
}

@Component({
  selector: 'mss-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
  providers: [EncryptPinBlockService]
})

export class CardViewComponent implements OnDestroy {

  card: CardDetailModel;

  cardStatusChangeVisible = false;
  cardPinChangeVisible = false;
  cardForm: FormGroup;
  encryptModel: IEncryptPinBlockModel = {
    pin: '',
    pan: '',
    rsaPublicKey: {
      algorithm: {
        name: ''
      },
      extractable: false,
      type: '',
      usages: [],
    }
  };
  private unsubscribe$ = new UnsubscribeSubject();

  constructor(private fb: FormBuilder,
              private crypto: EncryptPinBlockService,
              private store: Store<AppStateModel>,
              private api: ApiService,
              private toastr: ExtendedToastrService) {

    this.store.select('profile').takeUntil(this.unsubscribe$).subscribe(
      ({data, error}: StateModel<ProfileModel>) => {
        if (error instanceof MissingTokenResponse) {
          return;
        }

        if (error) {
          console.error('Error occurred while getting profile', error);
          return;
        }

        if (data != null) {
          this.store.dispatch({type: cardDetailActions.CARD_DETAIL_GET_REQUEST, payload: data.cardUuid});
        }
      }
    );

    this.store.select('cardDetail').takeUntil(this.unsubscribe$).subscribe(
      (data: StateModel<CardDetailModel>) => {
        if (data.error) {
          console.error('Error occurred while retrieving card detail.', data.error);
          return;
        }
        if (data.data != undefined && !data.loading) {
          this.card = data.data;
          this.encryptModel.pan = data.data.card.cln;
        }
      }
    );

    this.api.get('/cards/pinblock/key').subscribe(
      (data: PinblocKeyModel) => {
        this.crypto.importPublicKey(data).then(rsa =>
          this.encryptModel.rsaPublicKey = rsa
        );
      },
      error => {
        console.error('Error occurred while getting RSA key', error);
      }
    );

    this.cardForm = this.fb.group({
      newPin: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      confirmPin: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });
  }

  get disabledChange(): boolean {
    return this.cardForm.invalid ||
      !this.cardForm.get('newPin').touched ||
      (this.cardForm.get('newPin').value !== this.cardForm.get('confirmPin').value);
  }

  toggleStatusChange(): void {
    this.cardStatusChangeVisible = !this.cardStatusChangeVisible;
  }

  changePin(): void {
    this.encryptModel.pin = this.cardForm.get('newPin').value;
    this.crypto.encryptPinBlock(this.encryptModel).then((pinBlock: IEncryptedPinBlock) =>
      this.api
        .post('/cards/changepin', {aesKey: pinBlock.aesKeyHex, pinBlock: pinBlock.pinBlockHex, cardUuid: this.card.card.cardUuid})
        .subscribe(
          () => {
            this.toastr.success('toastr.success.changePin');
            this.toggleCardPin();
          },
          err => {
            this.toastr.error(err);
            console.error('Error occurred while changing pin');
          }
        )
    );
  }

  toggleCardStatus(): void {
    const state = this.card.card.state === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    this.api.post('/cards/state', {state, uuid: this.card.card.cardUuid}).subscribe(
      () => {
        this.toastr.success('toastr.success.changeCardStatus');
        this.store.dispatch({type: cardDetailActions.CARD_DETAIL_GET_REQUEST, payload: this.card.card.cardUuid});
        this.toggleStatusChange();
      },
      err => {
        this.toastr.error(err);
        console.error('Error occurred while changing card status');
        this.toggleStatusChange();
      }
    );
  }

  toggleCardPin(): void {
    this.cardPinChangeVisible = !this.cardPinChangeVisible;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }
}
