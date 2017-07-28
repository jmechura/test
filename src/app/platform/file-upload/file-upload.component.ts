import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateModel } from '../../shared/models/app-state.model';
import { importCodeActions } from '../../shared/reducers/import-code.reducer';
import { UnsubscribeSubject } from '../../shared/utils';
import { CodeModel } from '../../shared/models/code.model';
import { StateModel } from '../../shared/models/state.model';
import { SelectItem } from '../../shared/components/bronze/select/select.component';
import { FileUploadService } from '../../shared/services/fileUpload.service';

@Component({
  selector: 'mss-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [FileUploadService],
})
export class FileUploadComponent implements OnDestroy {

  private unsubscribe$ = new UnsubscribeSubject();

  importCodes: SelectItem[] = [];
  selectedCode: string;
  selectedFile: File;

  enableUpload = false;

  constructor(private store: Store<AppStateModel>, private fileUpload: FileUploadService) {
    this.store.dispatch({type: importCodeActions.IMPORT_CODE_GET_REQUEST});

    this.store.select('importCodes').takeUntil(this.unsubscribe$).subscribe(
      ({data, error, loading}: StateModel<CodeModel[]>) => {
        if (error) {
          console.error('Import Code API call has returned an error');
          return;
        }

        if (data != null && !loading) {
          this.importCodes = data.map(item => ({value: item.id, label: item.code}));
        }
      }
    );
  }

  selectCode(code: string): void {
    this.selectedCode = code;
    this.enableUpload = code != null && code.length > 1;
  }

  fileChange(file: File): void {
    this.selectedFile = file;
    this.fileUpload.uploadFile(this.selectedFile, this.selectedCode).subscribe(
      (response) => {
        console.info('Upload File response', response);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.fire();
  }

}
