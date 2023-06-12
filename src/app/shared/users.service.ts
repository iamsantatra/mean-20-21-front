import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Utilisateur } from '../models/user.model';

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  getUsers(): Observable<any> {
    return this.http.get<{message: string, data: Utilisateur[]}>(BACKEND_URL);
  }
  constructor(private http:HttpClient) { }
}
