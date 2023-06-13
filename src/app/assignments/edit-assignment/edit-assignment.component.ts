import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { UsersService } from 'src/app/shared/users.service';
import { MatieresService } from 'src/app/shared/matieres.service';

@Component({
 selector: 'app-edit-assignment',
 templateUrl: './edit-assignment.component.html',
 styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
 assignment!: Assignment | undefined;
 // associées aux champs du formulaire
 nomAssignment!: string;
 dateDeRendu!: Date;

 constructor(
   private assignmentsService: AssignmentsService,
   private route: ActivatedRoute,
   private router: Router,
   private usersService: UsersService,
   private matieresService: MatieresService
 ) {}

 ngOnInit(): void {
   this.getAssignment();
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
  console.log("nom :"  + queryParams['nom'])
  console.log("matière :" + queryParams['matiere'])
 
  // Exemple de récupération du fragment (après le # dans l'url)
  const fragment = this.route.snapshot.fragment;
  console.log("Fragment = " + fragment);
  if (id !== null) {
    this.assignmentsService.getAssignment(id)
    .subscribe((assignment) => {
      if (!assignment) return;
      this.assignment = assignment;
      // Pour pré-remplir le formulaire
      this.fetchMatiere(assignment);
      this.fetchEleve(assignment);
      this.fetchProf(assignment);
  });
  }
}
  onSaveAssignment() {
    if (!this.assignment) return;

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    // this.assignmentsService
    //   .updateAssignment(this.assignment)
    //   .subscribe((message) => {
    //     console.log(message);

    //     // navigation vers la home page
    //     this.router.navigate(['/home']);
    //   });
  }
  private fetchMatiere(assignment: Assignment): void {
    this.matieresService.getMatiereById(assignment.idMatiere)
      .subscribe(
        matiere => {
          assignment.matiere = matiere.data;
        },
        error => {
          console.log("Error fetching matiere:", error);
        }
      );
  }

  private fetchProf(assignment: Assignment): void {
    this.usersService.getProfByIdMatiere(assignment.idMatiere)
      .subscribe(
        prof => {
          assignment.prof = prof.data;
        },
        error => {
          console.log("Error fetching prof:", error);
        }
      );
  }

  private fetchEleve(assignment: Assignment): void {
    this.usersService.getUserById(assignment.idEleve)
      .subscribe(
        eleve => {
          assignment.eleve = eleve.data;
        },
        error => {
          console.log("Error fetching eleve:", error);
        }
      );
  }
}
