import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private datePipe: DatePipe) { }

  public formatDate(date: Date | undefined): string {
    return this.datePipe.transform(date, environment.dateFormat) || '';
  }
}
