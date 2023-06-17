import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifyerService {

  constructor(private matSnackBar: MatSnackBar) { }

  notifyBySnackBar(message : string) {
    this.matSnackBar.open(message, 'Fermer', {
      horizontalPosition: "end",
      verticalPosition: "bottom",
      duration:environment.snackbar
    }); 
  }
}
