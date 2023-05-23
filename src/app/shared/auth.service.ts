import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../models/user.model';

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  constructor(private http: HttpClient) { }

  // théoriquement, on devrait passer en paramètre le login
  // et le password, cette méthode devrait faire une requête
  // vers un Web Service pour vérifier que c'est ok, renvoyer
  // un token d'authentification JWT etc.
  // elle devrait renvoyer un Observable etc.
  logIn(username: String, password: String) {

    console.log("ON SE LOGGE")
    const authData = { nom: username, motDePasse: password };
    return this.http
      .post<{access_token: string, data: Utilisateur, expiresIn: number}>(BACKEND_URL + "/login", authData)
    this.loggedIn = true;
  }

  register(username: String, password: String, image: String, profil: String) {

    console.log("INSCRIPTION")
    let registerData: any = { nom: username, motDePasse: password, profil: profil };
    if(image != '') {
      registerData.image = image
    }
    
    return this.http
      .post<{data: Utilisateur}>(BACKEND_URL + "/register", registerData)
    this.loggedIn = true;
  }

  logOut() {
    console.log("ON SE DELOGGE")

    this.loggedIn = false;
  }

  // si on l'utilisait on ferai isAdmin().then(...)
  isAdmin() {
    // Pour le moment, version simplifiée...
    // on suppose qu'on est admin si on est loggué
    const isUserAdminPromise = new Promise((resolve, reject) => {
        resolve(this.loggedIn);
    });

    // on renvoie la promesse qui dit si on est admin ou pas
    return isUserAdminPromise;
  }
}
