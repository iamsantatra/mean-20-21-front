import { Component } from '@angular/core';
import { TokenStorageService } from '../shared/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  profil:string = ''
  nom:string = ''

  constructor(private tokenStorageService: TokenStorageService,
    private redirect: Router) { }
  
  ngOnInit() {
    const user = this.tokenStorageService.getUser();
    
    this.profil = user.profil;
    this.nom = user.nom;
  }

  onLogout() {
    this.tokenStorageService.signOut()
    this.redirect.navigate(["/login"])
  }
}
