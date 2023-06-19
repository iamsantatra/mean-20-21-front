import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { UsersService } from 'src/app/shared/users.service';
import { MatieresService } from 'src/app/shared/matieres.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Matiere } from 'src/app/models/matiere.model';
import { HelperService } from 'src/app/shared/helper.service';
import { Utilisateur } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifyerService } from 'src/app/shared/notifyer.service';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {

  assignment!: Assignment ;
  // associées aux champs du formulaire
  nomAssignment!: string;
  editForm!: FormGroup;
  matieres!: Matiere[];
  selectedMatiereId!: number;
  selectedEleveId!: number;
  eleves: Utilisateur[] = [];
  editFailed?: boolean = false;
  errorMessage?: string = "";
  today: Date = new Date();
  remarquesTxt?: string = "";
  isLoading: boolean = true;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private matieresService: MatieresService,
    private snackBar: MatSnackBar,
    private notifyer: NotifyerService
  ) {}

  get nomDevoir() {
    return this.editForm.get('nomDevoir');
  }

  get dateRendu() {
    return this.editForm.get('dateRendu');
  }

  get note() {
    return this.editForm.get('note');
  }

  get remarques() {
    return this.editForm.get('remarques');
  }

  get matieresNom() {
    return this.editForm.get('matieresNom');
  }

  get elevesNom() {
    return this.editForm.get('elevesNom');
  }

  ngOnInit(): void {
    this.getAssignment();
    this.createEditForm();
    this.getMatieres();
    this.getEleves()
  }
  createEditForm() {
    this.editForm = this.formBuilder.group({
      nomDevoir: ['', [Validators.required,  Validators.minLength(5), Validators.maxLength(30)]],
      note: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      dateRendu: ['', Validators.required],
      matieresNom: ['', Validators.required],
      elevesNom: ['', Validators.required],
      remarques: ['', Validators.maxLength(200)]
      // eleve: ['', Validators.required]
    });
  }

  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    // const id = +this.route.snapshot.params['id'];
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id: number | null = idParam !== null ? +idParam : null;
    // Exemple de récupération des query params (après le ? dans l'url)
    const queryParams = this.route.snapshot.queryParams;
    console.log(queryParams);

    if (id !== null) {
      this.assignmentsService.getAssignment(id)
      .subscribe((assignment) => {
        if (!assignment) { return this.router.navigate(['/home']) };
        this.assignment = assignment;
        this.formSetter(assignment);
        this.isLoading = false;
        return this.assignment;
      });
    }
  }

  formSetter(assignment: Assignment) {
    this.selectedMatiereId = assignment.idMatiere
    this.selectedEleveId = assignment.idEleve  
    this.nomDevoir?.setValue(assignment.nom)
    this.dateRendu?.setValue(this.helperService.formatDate(assignment.dateDeRendu))
    this.note?.setValue(assignment.note)
    this.remarques?.setValue(assignment.remarques)
    this.remarquesTxt = assignment.remarques
  }

  changeMatiere(e: any) {
    this.matieresNom?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  changeEleve(e: any) {
    this.elevesNom?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  getMatieres(): void {
    this.matieresService.getMatieres().subscribe((subject) => {
      this.matieres = subject.data
    });
  }

  getEleves(): void {
    // get users where user.profile = "Etudiant(e)"
    this.usersService.getUsers().subscribe((students) => {
      this.eleves = students.data.filter((student: Utilisateur) => student.profil === "Etudiant(e)")
    });
  }
  onUpdateAssignment() {
    if (this.editForm.valid && this.assignment) {
    
    console.log("before: ", this.assignment)

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomDevoir?.value;
    // cast this.note?.value en number
    this.assignment.note = +this.note?.value;
    this.assignment.remarques = this.remarques?.value;
    this.assignment.dateDeRendu = this.dateRendu?.value
    this.assignment.idMatiere = this.selectedMatiereId
    this.assignment.idEleve = this.selectedEleveId
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe(() => {
        // console.log(message);
        // navigation vers la home page
        this.notifyer.notifyBySnackBar("Modifications enregistrées");
        this.router.navigate(['/home']);
      }, error => {
        console.log(error);
        this.editFailed = true;
        this.errorMessage = error.error.message;
        this.notifyer.notifyBySnackBar("Une erreur est survenue, veuillez réessayer");
      });
    } console.log("tsy metyu validation")
  }

  onDeleteAssignment() {
    if (!this.assignment) { 
      console.log("tsy misy")
      return;
    }

    console.log("Suppression de l'assignment " + this.assignment.nom);
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce devoir ?");

    if (confirmation) {
      // on demande au service la suppression de l'assignment
      this.assignmentsService.deleteAssignment(this.assignment)
        .subscribe(message => {
          console.log(message);
          // Pour cacher le detail, on met l'assignment à null
          // this.assignment = undefined;
          this.openSnackBar();
          // et on navigue vers la page d'accueil
          this.router.navigate(["/home"]);
        }
      );
    }
  }

  openSnackBar() {
    this.snackBar.open('Devoir supprimé', 'Fermer', {
      duration:environment.snackbar,
      horizontalPosition: "end",
      verticalPosition: "bottom",
    });
  }
}
