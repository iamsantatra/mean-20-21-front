import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private datePipe: DatePipe) { }

  public formatDate(date: Date | undefined): string {
    return this.datePipe.transform(date, environment.dateFormat) || '';
  }

  validateDateMin(control: FormControl) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
  
    // Comparaison de la date sélectionnée avec la date actuelle
    if (selectedDate < currentDate) {
      return { dateMin: true }; // Retourne une erreur si la date est antérieure à aujourd'hui
    }
  
    return null; // Retourne null si la validation est réussie
  }
}
