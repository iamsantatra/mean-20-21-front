import { Component } from '@angular/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Router } from '@angular/router';
import { Matiere } from 'src/app/models/matiere.model';
import { MatieresService } from 'src/app/shared/matieres.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/shared/users.service';
import { Utilisateur } from 'src/app/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;
  eleves: Utilisateur[] = [];
  profs: Utilisateur[] = [];
  idMatiere!: number;
  idEleve!: number;

  constructor(private assignmentsService: AssignmentsService, private router:Router, 
    private matieresService: MatieresService, private formBuilder: FormBuilder,
    private usersService: UsersService, private snackBar: MatSnackBar ) { }

  onSubmit(event: any) {
    // On vérifie que les champs ne sont pas vides
    if (this.nomDevoir === "") return;
    if (this.dateDeRendu === undefined) return;

    let nouvelAssignment = new Assignment();
    // génération d'id, plus tard ce sera fait dans la BD
    nouvelAssignment.id = Math.abs(Math.random() * 1000000000000000);
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
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    console.log("this.firstFormGroup", this.firstFormGroup)
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      fourthCtrl: ['', Validators.required],
    });
  }

  getMatierebyId(id: Number){
    var matiere = this.matieres.find(e => e.id == id );
    return matiere
  }

  openSnackBar() {
    this.snackBar.open('Devoir ajouté', 'Fermer', {
      duration:1500,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }

  getElevebyId(id: Number){
    var eleve = this.eleves.find(e => e.id == id );
    return eleve
  }
  onAjoutAssignment() : void {
    if((!this.firstFormGroup.value.firstCtrl) || (!this.secondFormGroup.value.secondCtrl)|| (!this.thirdFormGroup.value.thirdCtrl)|| (!this.fourthFormGroup.value.fourthCtrl)) return;
    console.log(
      'nom = ' + this.firstFormGroup.value.firstCtrl + ' date de rendu = ' + this.secondFormGroup.value.secondCtrl + ' matiere = ' + this.thirdFormGroup.value.thirdCtrl + ' eleve = ' + this.fourthFormGroup.value.fourthCtrl
    );
    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.firstFormGroup.value.firstCtrl;
    newAssignment.dateDeRendu = this.secondFormGroup.value.secondCtrl;
    newAssignment.rendu = false;
    newAssignment.note = 0;
    newAssignment.remarques = "";
    newAssignment.idMatiere = this.thirdFormGroup.value.thirdCtrl;
    newAssignment.idEleve = this.fourthFormGroup.value.fourthCtrl;

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);
      // Redirect to '/home'
      this.router.navigateByUrl('/home');
    })
    this.openSnackBar();
  }
}
