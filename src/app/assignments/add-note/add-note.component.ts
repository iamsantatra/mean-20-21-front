import { Component, Inject } from '@angular/core';
import { Assignment } from '../assignment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent {  
  assignment! : Assignment // l'assignment à noter
  event : any //pour annuler et fermer le formulaire d'attribution de note
  noteForm!: FormGroup
  
  constructor(
    private formBuilder : FormBuilder,
    private assignmentsService : AssignmentsService,
    private matDialogRef : MatDialogRef<AddNoteComponent>,
    private matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit() : void{
    this.assignment = this.data.assignment
    this.event = this.data.event
    this.noteForm = this.formBuilder.group({
      note: new FormControl('10', [Validators.required, Validators.min(0), Validators.max(20)]),
      remarques: new FormControl('',[Validators.minLength(8)])
    });
  }

  get note () { return this.noteForm.get('note'); }
  get remarques (){ return this.noteForm.get('remarques'); }

  closeDialog(){
    this.matDialogRef.close();
  }

  cancel(){
    // remettre l'assignment dans la partie des non rendus
    // s'applique aussi aux cas d'erreurs de connexion au serveur, suppression des attributs note et remarques
    this.assignment.rendu=false;
    delete this.assignment['note'];
    delete this.assignment['remarques'];
    
    transferArrayItem(this.event.container.data,
      this.event.previousContainer.data,
      this.event.currentIndex,
      this.event.previousIndex);
      this.closeDialog();
  }
  
  notifyBySnackBar(message : string) {
    this.matSnackBar.open(message, 'Fermer', {
      horizontalPosition: "end",
      verticalPosition: "bottom",
      duration:environment.snackbar
    }); 
  }

  updateAssignment(){    
    this.assignment.note = this.noteForm.value.note;
    this.assignment.rendu = true;
    if(this.noteForm.value.remarques) this.assignment.remarques = this.noteForm.value.remarques;
    
    this.assignmentsService.updateAssignment(this.assignment)
    .subscribe((response:any)=> {
      this.closeDialog();
      this.notifyBySnackBar("Modifications enregistrées");
    },(error:any)=> {
      this.cancel();
      this.notifyBySnackBar("Il y a eu un problème de connexion au serveur, veuillez réessayer");
    })
  }
}
