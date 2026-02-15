import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

//import { AuthService } from 'tu-ruta-al-servicio'; // Importa tu servicio de autenticación
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
declare const bootstrap: any; // Añade esto al inicio del archivo
import { Router } from '@angular/router';
import { UserModel } from '../../models/UserModel.model';

import { ConceptService } from '../../services/concept.service';
import { ConceptModelRes } from '../../models/ConceptModelRes.model';
import { ConceptModelReq } from '../../models/ConceptModelReq.model';



import Swal from 'sweetalert2';


@Component({
  selector: 'app-login.component',
  imports: [
    ReactiveFormsModule,
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
    private http: HttpClient,
    private conceptService: ConceptService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  error = false;
  listConcepts: ConceptModelRes[] = [];
  userModel: UserModel = { userModel: '', passModel: '' };
  conceptModelReq: ConceptModelReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRisk: 0,
    isList: 0,
    nomConceptRisk: ""
  };
  
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

      localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value.username));
      this.getInitialConcept(1, 1, 0, 0,'Soluciones Legales Integrales')

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

  getInitialConcept(pIdApplication: number, 
                pIdCompany: number, 
                pIdConceptRisk: number,
                pIsList: number, 
                pNomConceptRisk: string 
               ){
    this.conceptModelReq.idApplication = pIdApplication;
    this.conceptModelReq.idCompany = pIdCompany;
    this.conceptModelReq.idConceptRisk = pIdConceptRisk;
    this.conceptModelReq.isList = pIsList;
    this.conceptModelReq.nomConceptRisk = pNomConceptRisk;
    this.conceptService.searchConcepts(this.conceptModelReq).subscribe({
    next: (response) => {
      this.listConcepts = response;
      localStorage.setItem('conceptTxtMain', JSON.stringify(this.listConcepts[0].nomCatalogRisk));
      localStorage.setItem('conceptTxtIDMain', JSON.stringify(this.listConcepts[0].idConceptRisk));      
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

}
