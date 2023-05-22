import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  errorMessage = "";
  loginFailed = false;

  constructor(private formBuilder: FormBuilder,
    public authService: AuthService) { }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      
      // Effectuez ici la logique de connexion
      this.authService.logIn(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(reponse => {
        var userConn = reponse;
        console.log(userConn)
        // sessionStorage.setItem("token", userT.token);
  
        // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
        // en gros, demander de naviguer vers /home
        // this.router.navigate(["/home"]);
      }, error => {
        this.loginFailed = true;
        this.errorMessage = error.error.message;
        console.log("erreur = " + error.error.message);
      })
    }
  }
}
