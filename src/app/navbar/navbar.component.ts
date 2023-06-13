import { Component } from '@angular/core';
import { TokenStorageService } from '../shared/token-storage.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  profil:string = ''
  nom:string = ''
  image:string = ''

  constructor(private tokenStorageService: TokenStorageService,
    private redirect: Router, private sanitizer: DomSanitizer) { }
  
  ngOnInit() {
    const user = this.tokenStorageService.getUser();
    console.log("user navbar: "+user)
    this.profil = user.profil;
    this.nom = user.nom;
    this.image = user.image;
  }

  getImageUrl(imagePath: string): string {
    const rootUrl = window.location.origin;
    return `${rootUrl}/${imagePath}`;
  }

  onLogout() {
    this.tokenStorageService.signOut()
    this.redirect.navigate(["/login"])
  }
}
