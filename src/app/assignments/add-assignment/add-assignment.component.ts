import { Component, EventEmitter } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Router } from '@angular/router';
import { Matiere } from 'src/app/models/matiere.model';
import { MatieresService } from 'src/app/shared/matieres.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/shared/users.service';
import { Utilisateur } from 'src/app/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/shared/helper.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent {

  // champs du formulaire
  nomDevoir = "";
  dateDeRendu!: Date;
  today: Date = new Date();
  matieres: Matiere[] = [];
  users: Utilisateur[] = [];
  nom!: FormGroup;
  dateRendu!: FormGroup;
  matiere!: FormGroup;
  eleve!: FormGroup;
  eleves: Utilisateur[] = [];
  profs: Utilisateur[] = [];
  idMatiere!: number;
  idEleve!: number;

  constructor(private assignmentsService: AssignmentsService, private router:Router, 
    private matieresService: MatieresService, private formBuilder: FormBuilder,
    private usersService: UsersService, private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddAssignmentComponent> ,
    private helpersService: HelperService) { }

  

  onSubmit(event: any) {
    // On vérifie que les champs ne sont pas vides
    if (this.nomDevoir === "") return;
    if (this.dateDeRendu === undefined) return;

    let nouvelAssignment = new Assignment();
    // génération d'id, plus tard ce sera fait dans la BD
    // nouvelAssignment.id = Math.abs(Math.random() * 1000000000000000);
    nouvelAssignment.nom = this.nomDevoir;
    nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.rendu = false;

    // on demande au service d'ajouter l'assignment
    this.assignmentsService.addAssignment(nouvelAssignment)
      .subscribe(message => {
        console.log(message);

        // On va naviguer vers la page d'accueil pour afficher la liste
        // des assignments
        this.router.navigate(["/home"]);

      });
  }

  getMatieres() {
    this.matieresService.getMatieres()
    .subscribe(response => {
      this.matieres = response.data;
    });
  }

  getUsers() {
    this.usersService.getUsers()
    .subscribe(response => {
      this.users = response.data;
      this.eleves = this.users.filter(u => u.profil == "Etudiant(e)");
      this.profs = this.users.filter(u => u.profil == "Professeur");
    });
  }

  ngOnInit(): void {
    this.getMatieres();
    this.getUsers();
    this.nom = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    console.log("this.nom", this.nom)
    this.dateRendu = this.formBuilder.group({
      secondCtrl: [this.today, [Validators.required, this.helpersService.validateDateMin]],
    });
    this.matiere = this.formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.eleve = this.formBuilder.group({
      fourthCtrl: ['', Validators.required],
    });
  }

  getMatierebyId(id: Number){
    var matiere = this.matieres.find(e => e.id == id );
    return matiere
  }

  openSnackBar() {
    this.snackBar.open('Devoir ajouté', 'Fermer', {
      duration: environment.snackbar,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  getElevebyId(id: Number){
    var eleve = this.eleves.find(e => e.id == id );
    return eleve
  }

  assignmentCreated: EventEmitter<Assignment> = new EventEmitter<Assignment>();
  onAjoutAssignment() : void {
    if((!this.nom.value.firstCtrl) || (!this.dateRendu.value.secondCtrl)|| (!this.matiere.value.thirdCtrl)|| (!this.eleve.value.fourthCtrl)) return;
    console.log(
      'nom = ' + this.nom.value.firstCtrl + ' date de rendu = ' + this.dateRendu.value.secondCtrl + ' matiere = ' + this.matiere.value.thirdCtrl + ' eleve = ' + this.eleve.value.fourthCtrl
    );
    let newAssignment = new Assignment();
    // newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.nom.value.firstCtrl;
    newAssignment.dateDeRendu = this.dateRendu.value.secondCtrl;
    newAssignment.rendu = false;
    newAssignment.note = 0;
    newAssignment.remarques = "";
    newAssignment.idMatiere = this.matiere.value.thirdCtrl;
    newAssignment.idEleve = this.eleve.value.fourthCtrl;
    this.matieresService.fetchMatiere(newAssignment);
    this.usersService.fetchEleve(newAssignment);
    this.usersService.fetchProf(newAssignment);

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);
      // Redirect to '/home'
      // this.router.navigateByUrl('/home');
      newAssignment._id = reponse.data._id
      newAssignment.idAssignment = reponse.data.idAssignment
      this.assignmentCreated.emit(newAssignment);
      this.dialogRef.close();
    })
    this.openSnackBar();
  }
}
