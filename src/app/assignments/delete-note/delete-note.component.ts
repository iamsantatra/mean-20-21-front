import { transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AddNoteComponent } from '../add-note/add-note.component';
import { Assignment } from '../assignment.model';
import { environment } from 'src/environments/environment';
import { NotifyerService } from 'src/app/shared/notifyer.service';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.css']
})
export class DeleteNoteComponent {
  assignment! : Assignment // l'assignment à modifier
  event : any //pour annuler et fermer le formulaire d'attribution de note

  constructor(
    private assignmentsService : AssignmentsService,
    private matDialogRef : MatDialogRef<AddNoteComponent>,
    private notifyer: NotifyerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(){
   this.assignment = this.data.assignment
    this.event = this.data.event
  }

  /*notifyBySnackBar(message : string) {
    this.matSnackBar.open(message, 'Fermer', {
      horizontalPosition: "end",
      verticalPosition: "bottom",
      duration:environment.snackbar
    }); 
  }*/

  cancel(){
    console.log("remise de l'assignment dans la partie des non rendus");
    transferArrayItem(this.event.container.data,
                      this.event.previousContainer.data,
                      this.event.currentIndex,
                      this.event.previousIndex
                      );
    this.matDialogRef.close();
  }

  updateAssignment(){
    const n = this.assignment.note;
    const r = this.assignment.remarques;

    this.assignment.rendu = false;
    this.assignment.note = 0;
    this.assignment.remarques = "";

    this.assignmentsService.updateAssignment(this.assignment)
    .subscribe((response:any)=> {
      this.matDialogRef.close();
      this.notifyer.notifyBySnackBar("Devoir #"+this.assignment.idAssignment+" annulé");
    },(error:any)=> {
      this.assignment.rendu = true;
      this.assignment.note = n;
      this.assignment.remarques = r;
      this.cancel();
      this.notifyer.notifyBySnackBar("Il y a eu un problème de connexion au serveur, veuillez réessayer");
    })
  }
}
