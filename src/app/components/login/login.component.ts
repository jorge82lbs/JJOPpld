import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { AuthService } from 'tu-ruta-al-servicio'; // Importa tu servicio de autenticación
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
declare const bootstrap: any; // Añade esto al inicio del archivo
import { Router } from '@angular/router';
import { UserModel } from '../../models/UserModel.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login.component',
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,   
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  error = false;
  userModel: UserModel = { userModel: '', passModel: '' };
  
  showPassword = false;

  async onSubmit() {
  if (this.loginForm.valid) {

      // const isValidUser = await this.authService.login(
      //   this.loginForm.value.username,
      //   this.loginForm.value.password
      // );
      //const isValidUser = true;

      this.userModel.userModel=this.loginForm.value.username;
      this.userModel.passModel= this.loginForm.value.password;


      Swal.fire({
        title: "Validando Acceso!",
        html: "Validando información, espere un momento.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(2000);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
          this.router.navigateByUrl('/concepts');
        }
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
