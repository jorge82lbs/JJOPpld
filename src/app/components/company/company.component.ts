import { Component, OnInit } from '@angular/core';
import { DatePipe,formatDate  } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
import { Sort, MatSortModule } from '@angular/material/sort';

import { CompanyService } from '../../services/company.service';
import { CompanyListReq } from '../../models/company/CompanyListReq.model';
import { CompanyListRes } from '../../models/company/CompanyListRes.model';
import { CompanyCrudReq } from '../../models/company/CompanyCrudReq.model';
import { CompanyCrudRes } from '../../models/company/CompanyCrudRes.model';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-company',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSortModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css',
})
export class CompanyComponent implements OnInit {

  searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,    
    private companyService: CompanyService
    ) {
      this.searchForm = this.fb.group({
        searchTerm: ['']
      });      
      this.saveForm = this.fb.group({
        htmlRfc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlDesc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
        htmlEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
      })

    }

  error = false;
  loggedUser: string = '';

  listMain: CompanyListRes[] = [];
  listMainOrg: CompanyListRes[] = [];

  saveForm: FormGroup;

  companyCrudReq: CompanyCrudReq = {
    idCompany: 0,
    idApplication: 0,
    indRfc: '',
    indDescription: '',
    indEmail: '',
    indEstatus: '',
    username: '',
    operationType: 0
  };

  companyCrudRes: CompanyCrudRes = {
    codeStatus: '',
    codeDescription: ''
  }

  companyListReq: CompanyListReq = {
    idCompany: 0,
    idApplication: 0,
    operationType: 0
  }
  
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');        
    this.loggedUser = user;       
    this.getInitialList(1,1,1);

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

  getInitialList(pIdApplication: number,
                 pIdCompany: number,
                 pTypeOperation: number
                ){
    this.companyListReq.idApplication = pIdApplication;
    this.companyListReq.idCompany = pIdCompany;
    this.companyListReq.operationType = pTypeOperation;
    
    this.companyService.getListCompanies(this.companyListReq).subscribe({
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

  onSaveAction(){
    
    this.companyCrudReq.idCompany = 0;
    this.companyCrudReq.idApplication = 1;
    this.companyCrudReq.indRfc = this.saveForm.value.htmlRfc;
    this.companyCrudReq.indDescription = this.saveForm.value.htmlDesc;
    this.companyCrudReq.indEmail = this.saveForm.value.htmlEmail;
    this.companyCrudReq.indEstatus = 'A';
    this.companyCrudReq.username = 'jlbautistas';
    this.companyCrudReq.operationType = 1;

    this.companyService.crudCompany(this.companyCrudReq).subscribe({
      next: (responseSave) => {     
        
        this.companyCrudRes = responseSave;
        if (this.companyCrudRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Empresas",
              text: "La Empresa fue almacenado satisfactoriamente",
              footer: '<p>Concepto <strong>'+this.saveForm.value.htmlDesc+'</strong> guardado con éxito</p>'
            });
            //this.refreshApiTable();
            this.onCloseSave();
            this.getInitialList(1, 1, 1);
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.companyCrudRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.companyCrudRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('(Main) exception: ', this.error);
      }
    });	    

  }


}


