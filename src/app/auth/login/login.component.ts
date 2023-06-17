import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { TokenStorageService } from 'src/app/shared/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  errorMessage = "";
  loginFailed = false;
  isLoading = true;

  constructor(private formBuilder: FormBuilder,
    public authService: AuthService,
    public tokenService: TokenStorageService,
    public router: Router) { }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.createLoginForm();
    if (this.tokenService.getToken() && this.tokenService.getUser()) {
      this.router.navigate(["/home"]);
    }
    this.router.events.subscribe(event => {
      setTimeout(() => {
        this.isLoading = false;
      }, 2750);
    });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['Gabriel', Validators.required],
      password: ['12345678', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.isLoading = true;
      // Effectuez ici la logique de connexion
      this.authService.logIn(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(data => {
        var userConn = data;
        console.log(userConn)
        this.tokenService.saveToken(data.access_token)
        this.tokenService.saveUser(data.data)
        // sessionStorage.setItem("token", userT.token);
  
        // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
        // en gros, demander de naviguer vers /home
        this.isLoading = false;
        this.router.navigate(["/home"]);
      }, error => {
        this.loginFailed = true;
        this.errorMessage = error.error.message;
        this.isLoading = false;
        console.log("erreur = " + error.error.message);
      })
    }
  }
}
