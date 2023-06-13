import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css']
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis!: Assignment;

  constructor(private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AssignmentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      // console.log(data);
      this.assignmentTransmis = data;
    }
  
  ngOnInit(): void {
    // appelée avant le rendu du composant
    // on va chercher l'id dans l'url active
    // en mettant + on force la conversion en number
    // const id = +this.route.snapshot.params['id'];
    // console.log("Dans le ngOnInit de detail, id = " + id);

    // // on va chercher l'assignment à afficher
    // this.assignmentsService.getAssignment(id)
    //   .subscribe(assignment => {
    //     this.assignmentTransmis = assignment;
    //   });
    console.log("Dans le ngOnInit de detail")
    console.log(this.assignmentTransmis)
  }
  assignmentDeleted: EventEmitter<Assignment> = new EventEmitter<Assignment>();
  onDeleteAssignment() {
    if (!this.assignmentTransmis) return;

    console.log("Suppression de l'assignment " + this.assignmentTransmis.nom);

    // on demande au service la suppression de l'assignment
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        // Pour cacher le detail, on met l'assignment à null
        // this.assignmentTransmis = undefined;
        this.openSnackBar();
        // et on navigue vers la page d'accueil
        // this.router.navigate(["/home"]);
        this.dialogRef.close();
        this.assignmentDeleted.emit(this.assignmentTransmis);
      });
  }

  openSnackBar() {
    this.snackBar.open('Devoir supprimé', 'Fermer', {
      duration:environment.snackbar,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  onAssignmentRendu() {
    if (!this.assignmentTransmis) return;

    this.assignmentTransmis.rendu = true;

    // on appelle le service pour faire l'update
    this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
      });
  }

  onEditAssignment() {
    // navigation vers la page edit
    // équivalent à "/assignment/2/edit" par exemple
    // path = "/assignment/" + this.assignmentTransmis?.id + "/edit";
    // this.router.navigate([path]);
    // c'est pour vous montrer la syntaxe avec [...]
    this.router.navigate(["/assignments", this.assignmentTransmis?.idAssignment, "edit"],
    {
      // queryParams: {
      //   nom: this.assignmentTransmis?.nom,
      //   matiere: "Angular"
      // },
      fragment: "edition"
    });
    this.dialogRef.close();
  }
  
  isLogged() {
    // renvoie si on est loggé ou pas
    return this.authService.loggedIn;
  }
}
