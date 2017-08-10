import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';
import * as moment from 'moment';

@Pipe({
  name: 'mssDate'
})
export class MssDatePipe implements PipeTransform {

  dateFormat = 'DD. MM. YYYY';

  constructor(private configService: AppConfigService) {
    this.configService.get('dateFormat').subscribe(
      (format: string) => {
        this.dateFormat = format;
      }
    );
  }

  transform(value: any, args?: any): any {
    return moment(value).format(this.dateFormat);
  }

}
