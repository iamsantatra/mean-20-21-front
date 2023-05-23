import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { TokenStorageService } from 'src/app/shared/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage = "";
  registerFailed = false;

  constructor(private formBuilder: FormBuilder,
    public authService: AuthService,
    public tokenService: TokenStorageService,
    public router: Router) { }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get image() {
    return this.registerForm.get('image');
  }

  get profil() {
    return this.registerForm.get('profil');
  }

  ngOnInit() {
    this.createLoginForm();
    if (this.tokenService.getToken() && this.tokenService.getUser()) {
      this.router.navigate(["/home"]);
    }

  }

  createLoginForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      image: ['', this.fileTypeValidator],
      profil: ['', Validators.required]
    });
  }

  // Fonction de validation personnalisée pour le type de fichier
  fileTypeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const allowedTypes = ['image/jpeg', 'image/png']; // Types de fichiers autorisés

    if (control.value) {
      const file = control.value as File;
      if (allowedTypes.includes(file.type)) {
        return null; // Le type de fichier est valide
      } else {
        return { invalidFileType: true }; // Le type de fichier est invalide
      }
    }

    return null; // Aucun fichier sélectionné
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value)
      // Effectuez ici la logique de connexion
      
      this.authService.register(this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.image, this.registerForm.value.profil)
      .subscribe(data => {
        var userReg = data;
        console.log(userReg)
        // this.tokenService.saveToken(data.access_token)
        // this.tokenService.saveUser(data.data)
        // sessionStorage.setItem("token", userT.token);
  
        // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
        // en gros, demander de naviguer vers /home
        this.router.navigate(["/login"]);
      }, error => {
        this.registerFailed = true;
        this.errorMessage = error.error.message;
        console.log("erreur = " + error.error.message);
      })
    }
  }
}
