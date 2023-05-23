import { Component, Inject } from '@angular/core';
import { Assignment } from '../assignment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AssignmentsService } from 'src/app/shared/assignments.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent {  
  assignment! : Assignment

  //note  =  new FormControl('', [Validators.required, Validators.pattern(/^(([0-9]|1[0-9]|20)(\.[0-9]+)?)$/), Validators.max(20), Validators.min(0) ]);
  note!: number 
  remarques?: string

  constructor(
    private assignmentsService : AssignmentsService,
    private dialogRef : MatDialogRef<AddNoteComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(){
    this.assignment = this.data.assignment
  }

  validNote(){
    return this.note >=0 && this.note <=20
  }

  /*getErrorMessage(){
    this.note.hasError('pattern') ? 'Veuillez entrer une note comprise entre 0 et 20' : '';
  }*/

  closeDialog(){
    this.dialogRef.close();
  }

  updateAssignment(){
    //this.assignment.note = Number(this.note.value);
    this.assignment.note = this.note;
    this.assignment.rendu = true;
    console.log("note attribuée=",this.assignment);
    if(this.remarques) this.assignment.remarques = this.remarques

    this.assignmentsService.updateAssignment(this.assignment)
    .subscribe((response:any)=> {
      this.closeDialog();
      //affichage du snackbar
    },(error:any)=> {
      console.log("Il y a eu une erreur lors de la connexion au serveur");
    })
  }
}
