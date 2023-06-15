import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Assignment } from './assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { UsersService } from '../shared/users.service';
import { MatieresService } from '../shared/matieres.service';
import { AddNoteComponent } from './add-note/add-note.component';
import { DeleteNoteComponent } from './delete-note/delete-note.component';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  titre="Liste des devoirs à rendre";
  // les données à afficher
  assignments:Assignment[] = [];
  rendus : Assignment[] = [];
  nonRendus : Assignment[] = [];
  // Pour la data table
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];

  // propriétés pour la pagination
  page: number=1;
  limit: number=10;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;
  searchTerm! : string;
  onSearch() {
    this.getAssignments(); 
  }
  constructor(private assignmentsService:AssignmentsService,
              private ngZone: NgZone,
              public dialog: MatDialog,
              private usersService: UsersService, private matieresService: MatieresService) {    
  }
  
  ngOnInit(): void {
    console.log("OnInit Composant instancié et juste avant le rendu HTML (le composant est visible dans la page HTML)");
    // exercice : regarder si il existe des query params
    // page et limit, récupérer leur valeurs si elles existent
    // et les passer à la méthode getAssignments
    // TODO

    this.getAssignments();
  }

  ngAfterViewInit() { 
    console.log("after view init");

    if(!this.scroller) return;

    // on s'abonne à l'évènement scroll de la liste
    this.scroller.elementScrolled()
    .pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
         return this.scroller.measureScrollOffset('bottom');
      }),
      tap(y => {
        //console.log("y = " + y);
      }),
      pairwise(),
      tap(([y1, y2]) => {
        //console.log("y1 = " + y1 + " y2 = " + y2);
      }),
      filter(([y1, y2]) => {
        return y2 < y1 && y2 < 100;
      }),
      // Pour n'envoyer des requêtes que toutes les 200ms
      //throttleTime(200)
    )
    .subscribe((val) => {
      console.log("val = " + val);
      console.log("je CHARGE DE NOUVELLES DONNEES page = " + this.page);
      this.ngZone.run(() => {
        if(!this.hasNextPage) return;

        this.page = this.nextPage;
        this.getAddAssignmentsForScroll();
      });
    });
  }

  getAssignments() {
    console.log("On va chercher les assignments dans le service");
  
    this.assignmentsService.getAssignments(this.page, this.limit)
      .subscribe(data => {
        this.mapAssignments(data.docs);
        this.page = data.page;
        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        
        if (!this.searchTerm) {
          this.rendus = this.assignments.filter(a => a.rendu == true);
          this.nonRendus = this.assignments.filter(a => a.rendu == false);
        } else {
          this.rendus = this.assignments.filter(a => a.rendu == true && a.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
          this.nonRendus = this.assignments.filter(a => a.rendu == false && a.nom.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }

        console.log("Données reçues");
      });
  }
  
  private mapAssignments(assignments: Assignment[]): void {
    this.assignments = [];
    assignments.forEach(assignment => {
      const mappedAssignment: Assignment = {
        _id: assignment._id,
        idAssignment: assignment.idAssignment,
        nom: assignment.nom,
        dateDeRendu: assignment.dateDeRendu,
        rendu: this.confRendu(assignment),
        note: this.confNote(assignment),
        idMatiere: assignment.idMatiere,
        idEleve: assignment.idEleve,
        remarques: this.confRemarque(assignment),
      };
  
      this.matieresService.fetchMatiere(mappedAssignment);
      this.usersService.fetchEleve(mappedAssignment);
      this.usersService.fetchProf(mappedAssignment);
      this.assignments.push(mappedAssignment);
    });
  }

  private confRendu(assignment: Assignment): boolean {
    // if assignment.rendu? is undefined or null, then return false
    return assignment.rendu ? assignment.rendu : false;
  }

  private confNote(assignment: Assignment): number {
    // if assignment.note? is undefined or null, then return 0
    return assignment.note ? assignment.note : 0;
  }

  private confRemarque(assignment: Assignment): string {
    // if assignment.remarques? is undefined or null, then return ""
    return assignment.remarques ? assignment.remarques : "";
  }
  
  getAddAssignmentsForScroll() {
    this.assignmentsService.getAssignments(this.page, this.limit)
    .subscribe(data => {
      // au lieu de remplacer le tableau, on va concaténer les nouvelles données
      this.assignments = this.assignments.concat(data.docs);
      // ou comme ceci this.assignments = [...this.assignments, ...data.docs]
      //this.assignments = data.docs;
      this.page = data.page;
      this.limit = data.limit;
      this.totalDocs = data.totalDocs;
      this.totalPages = data.totalPages;
      this.hasPrevPage = data.hasPrevPage;
      this.prevPage = data.prevPage;
      this.hasNextPage = data.hasNextPage;
      this.nextPage = data.nextPage;

      console.log("Données ajoutées pour scrolling");
    });
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  pageSuivante() {
    this.page = this.nextPage;
    this.getAssignments();
  }

  pagePrecedente() {
    this.page = this.prevPage;
    this.getAssignments();
  }
  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  // Pour mat-paginator
  handlePage(event: any) {
    console.log(event);
   
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getAssignments();
  }


  onDrop(event: any) {
    if(event.previousContainer != event.container){
        let dropped = event.previousContainer.data[event.previousIndex];
        //placer l'element dans le container où il a été déposé 
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex
                        );

        if(event.container.id == "rendus"){  // si ils sont déposés dans le div #rendus, besoin si ajout d'annulation de rendu
          console.log("rendre le devoir ", dropped);
          this.dialog.open(AddNoteComponent, { disableClose: true,  maxWidth: '20vw', data: { assignment : dropped, event: event} });
        }else{
          this.dialog.open(DeleteNoteComponent, { disableClose:true, maxWidth: '30vw', data: { assignment: dropped, event: event } });
        }
    }
  } 

  onAjoutDevoir() {
    const dialogRef = this.dialog.open(AddAssignmentComponent, {maxWidth:'35vw'});
    // Subscribe to the assignmentCreated event
    dialogRef.componentInstance.assignmentCreated.subscribe((newAssignment: Assignment) => {
      // Add the new assignment to the list of assignments
      this.assignments.unshift(newAssignment);
    });
  }

  onDetailDevoir(assignment: Assignment) {
    if(!assignment) return;
    const dialogRef = this.dialog.open(AssignmentDetailComponent, {
      width:'35vw',
      data: assignment});
    // dialogRef.afterClosed().subscribe(result => {
    //   this.getAssignments();
    // });
    // dialogRef.componentInstance.assignmentDeleted.subscribe((assignmentDeleted: Assignment) => {
    //   console.log("assignmentDeleted")
    //   console.log(assignmentDeleted)
    //   this.assignments = this.assignments.filter(assignment => assignment.idAssignment !== assignmentDeleted.idAssignment);
    // });
  }

  options: AnimationOptions = {
    path: 'https://assets7.lottiefiles.com/packages/lf20_B2qAl3/data.json',
  };

  // animationCreated(animationItem: AnimationItem): void {
  //   console.log(animationItem);
  // }

  getAnimationOptions(animationUrl?: string): AnimationOptions {
    const defaultAnimationUrl = 'https://assets7.lottiefiles.com/packages/lf20_B2qAl3/data.json';
    const path = animationUrl || defaultAnimationUrl;
  
    return {
      path,
      loop: true,
      autoplay: true,
    };
  }
}
