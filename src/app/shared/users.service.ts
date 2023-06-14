import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../models/user.model';
import { Assignment } from '../assignments/assignment.model';

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  getUsers(): Observable<any> {
    return this.http.get<{message: string, data: Utilisateur[]}>(BACKEND_URL);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<{message: string, data: Utilisateur}>(BACKEND_URL+"/"+id);
  }
  getProfByIdMatiere(idMatiere: number): Observable<any> {
    return this.http.get<{message: string, data: Utilisateur}>(BACKEND_URL+"/prof/"+idMatiere);
  }
  constructor(private http:HttpClient) { }

  public fetchProf(assignment: Assignment): void {
    this.getProfByIdMatiere(assignment.idMatiere)
      .subscribe(
        prof => {
          assignment.prof = prof.data;
        },
        error => {
          console.log("Error fetching prof:", error);
        }
      );
  }

  public fetchEleve(assignment: Assignment): void {
    this.getUserById(assignment.idEleve)
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
