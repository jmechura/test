import { Component, OnDestroy, ViewChild } from '@angular/core';
import { StateModel } from '../../shared/models/state.model';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { SequencesModel } from '../../shared/models/sequences.model';
import { sequencesActions } from '../../shared/reducers/sequences.reducer';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UnsubscribeSubject } from '../../shared/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'mss-sequences',
  templateUrl: './sequences.component.html',
  styleUrls: ['./sequences.component.scss']
})
export class SequencesComponent implements OnDestroy {

  sequenceRows: any[];
  loading = false;
  rowLimit = 10;
  userResource: SelectItem[] = [];
  modalShowing = false;
  private unsubscribe$ = new UnsubscribeSubject();
  code: SelectItem[];
  deletingRow: any;
  warnModalVisible = false;

  @ViewChild('table') table: DatatableComponent;

  constructor(private store: Store<AppStateModel>,
              private router: Router) {
    this.store.dispatch({type: sequencesActions.SEQUENCES_GET_REQUEST});

    this.store.select('sequences').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<SequencesModel[]>) => {
        this.loading = loading;
        if (error) {
          console.error('Sequence API call has returned error', error);
          return;
        }
        if (data != undefined) {
          this.sequenceRows = data.map(item => ({
            order: item.order,
            template: item.template,
            resource: item.pk.resource,
            resourceId: item.pk.resourceId,
            type: item.pk.type
          }));
        }
      }
    );
  }

  redirectToSequenceCreation(): void {
    this.router.navigateByUrl('/platform/sequences/create');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

  showDeleteModal(row: any, event: MouseEvent): void {
    event.stopPropagation();
    this.toggleWarnModal();
    this.deletingRow = row;
  }

  toggleWarnModal(): void {
    this.warnModalVisible = !this.warnModalVisible;
  }

  deleteRow(): void {
    this.store.dispatch({type: sequencesActions.SEQUENCES_DELETE_REQUEST, payload: this.deletingRow});
    this.toggleWarnModal();
  }

  changeLimit(limit: number): void {
    this.rowLimit = limit;

    setTimeout(
      () => {
        this.table.recalculate();
      },
      0
    );
  }

  redirectToDetail(event: any): void {
    this.router.navigateByUrl(`platform/sequences/${event.row.type}-${event.row.resource}-${event.row.resourceId}`);
  }
}
