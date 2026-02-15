import { Component, OnInit } from '@angular/core';
import { DatePipe,formatDate  } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
import { Sort, MatSortModule } from '@angular/material/sort';

import { UserService } from '../../services/user.service';
import { UserListReq } from '../../models/users/UserListReq.model';
import { UserListRes } from '../../models/users/UserListRes.model';
import { UserCrudReq } from '../../models/users/UserCrudReq.model';
import { UserCrudRes } from '../../models/users/UserCrudRes.model';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSortModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {

  searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,    
    private userService: UserService
    ) {
      this.searchForm = this.fb.group({
        searchTerm: ['']
      });      
      this.saveForm = this.fb.group({
        htmlRfc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],        
        htmlSecondName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlUserName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlDesc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlRol: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]        
      })

    }

  error = false;
  loggedUser: string = '';
  conceptTxtMain: string = ''; 
  conceptTxtIDMain: string = ''; 

  saveForm: FormGroup;

  listMain: UserListRes[] = [];
  listMainOrg: UserListRes[] = [];

  userCrudReq: UserCrudReq = {
    idUser: 0,
    idApplication: 0,
    idCompany: 0,
    indRfc: '',
    indFirstName: '',
    indSecondName: '',
    indName: '',
    indUsername: '',
    indDescription: '',
    indEmail: '',
    indRol: '',
    indEstatus: '',
    username: '',
    operationType: 0
  };

  userCrudRes: UserCrudRes = {
    codeStatus: '',
    codeDescription: ''
  };

  userListReq: UserListReq = {
    idUser: 0,    
    idApplication: 0,
    idCompany: 0,
    operationType: 0
  };


  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');    
    const conceptTxt = JSON.parse(localStorage.getItem('conceptTxtMain') || '{}');    
    this.loggedUser = user;   
    this.conceptTxtMain = conceptTxt;
    this.conceptTxtIDMain = JSON.parse(localStorage.getItem('conceptTxtIDMain') || '{}');     
    this.getInitialList(0,1,1,1);

  }

  getInitialList(pIdUser: number,
                 pIdApplication: number,
                 pIdCompany: number,
                 pTypeOperation: number
                ){
    
    this.userListReq.idUser = pIdUser;
    this.userListReq.idApplication = pIdApplication;
    this.userListReq.idCompany = pIdCompany;
    this.userListReq.operationType = pTypeOperation;
    
    this.userService.getListUsers(this.userListReq).subscribe({
    next: (response) => {
      this.listMain = response;
      this.listMainOrg = response;
      console.log("Lista principal: ", this.listMain);    
    },
      error: () => {
        this.error = true;
      }
    });	
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
  
  goQualify() {    
    this.router.navigate(['/qualify']);
  }
  
  goClients() {    
    this.router.navigate(['/clients']);
  }

  goConcepts(){
    this.router.navigate(['/concepts']);
  }    
  
  sortData(sort: Sort) {

  }

  onOpenSave(){
    const modal = document.getElementById('modalSave');    
    if(modal != null){
      modal.style.display = 'block';              
    }   

  }
  onCloseSave(){
    const modal = document.getElementById('modalSave');    
    if(modal != null){
      modal.style.display = 'none';              
    }

  }

  onSearchTable(event: Event, typeCol: number){

  }

  onOpenUpdate(item: any) {

  }
  onOpenDelete(item: any) {

  }

  onOpenPopup(item: any){

  }

  onSaveAction(){
    
    this.userCrudReq.idUser = 0;
    this.userCrudReq.idApplication = 1;
    this.userCrudReq.idCompany = 1;
    this.userCrudReq.indRfc = this.saveForm.value.htmlRfc;
    this.userCrudReq.indFirstName = this.saveForm.value.htmlFirstName;
    this.userCrudReq.indSecondName = this.saveForm.value.htmlSecondName;
    this.userCrudReq.indName = this.saveForm.value.htmlName;
    this.userCrudReq.indUsername = this.saveForm.value.htmlUserName;
    this.userCrudReq.indDescription = this.saveForm.value.htmlDesc;
    this.userCrudReq.indEmail = this.saveForm.value.htmlEmail;
    this.userCrudReq.indRol = this.saveForm.value.htmlRol;
    this.userCrudReq.indEstatus = 'A';
    this.userCrudReq.username = 'jlbautistas';
    this.userCrudReq.operationType = 1;

    this.userService.crudUsers(this.userCrudReq).subscribe({
      next: (responseSave) => {     
        
        this.userCrudRes = responseSave;
        if (this.userCrudRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Usuarios",
              text: "El usuario fue almacenado satisfactoriamente",
              footer: '<p>Usuario <strong>'+this.saveForm.value.htmlUserName+'</strong> guardado con éxito</p>'
            });
            //this.refreshApiTable();
            this.onCloseSave();
            this.getInitialList(1, 1, 1, 1);
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.userCrudRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.userCrudRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('(Main) exception: ', this.error);
      }
    });	    

  }


}
