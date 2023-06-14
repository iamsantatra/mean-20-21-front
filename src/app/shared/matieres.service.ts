import { Injectable } from '@angular/core';
import { Matiere } from '../models/matiere.model';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';

const BACKEND_URL = environment.apiUrl + "/matieres";

@Injectable({
  providedIn: 'root'
})
export class MatieresService {

  matieres:Matiere[] = []
  
  constructor(private http:HttpClient) { }
  
  getMatieres():Observable<any> {
    return this.http.get<{message: string, data: Matiere[]}>(BACKEND_URL);
  }

  getMatiereById(id: number): Observable<any> {
    return this.http.get<{message: string, data: Matiere}>(BACKEND_URL+"/"+id);
  }

  public fetchMatiere(assignment: Assignment): void {
    this.getMatiereById(assignment.idMatiere)
      .subscribe(
        matiere => {
          assignment.matiere = matiere.data;
        },
        error => {
          console.log("Error fetching matiere:", error);
        }
      );
  }
}
