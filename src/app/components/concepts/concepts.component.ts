import { Component, ElementRef, ViewChild, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
declare const bootstrap: any; // Añade esto al inicio del archivo
import { Router } from '@angular/router';
import { ConceptModelRes } from '../../models/ConceptModelRes.model';
import { ConceptModelReq } from '../../models/ConceptModelReq.model';
import { ConceptService } from '../../services/concept.service';
import { ConceptReq } from '../../models/ConceptReq.model';
import { ConceptRes } from '../../models/ConceptRes.model';
import {Sort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { RelMainReq } from '../../models/RelMainReq.model';
import { RelMainResponse } from '../../models/RelMainResponse.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-concepts.component',
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
],
  templateUrl: './concepts.component.html',
  styleUrl: './concepts.component.css'
})
export class ConceptsComponent implements OnInit {

  searchForm: FormGroup;
  
  @ViewChild('modalSaveConcept') modalSaveConcept: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private conceptService: ConceptService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
    this.validateForm = this.fb.group({
      conceptTxt: ['', Validators.required]
    });
    this.validateUpdForm = this.fb.group({
      conceptUpdTxt: ['', Validators.required],
      conceptUpdIdTxt: []
    });
    this.validateDelForm = this.fb.group({
      conceptDelTxt: [],
      conceptDelIdTxt: []
    });

    this.sortedData = this.listConcepts.slice();

  }

  conceptModelReq: ConceptModelReq = {
    idApplication: 0,
    idCompany: 0 
  };

  listConcepts: ConceptModelRes[] = [];
  listRelMainResponse: RelMainResponse[] = [];
  sortedData: ConceptModelRes[] = [];
  listConceptsOriginal: ConceptModelRes[] = [];
  error = false;
  showResults = false;
  conceptTxt: string = ''; 
  conceptUpdTxt: string = ''; 
  conceptUpdIdTxt: string = ''; 
  conceptDelTxt: string = ''; 
  conceptDelIdTxt: string = ''; 
  validateForm: FormGroup;
  validateUpdForm: FormGroup;
  validateDelForm: FormGroup;

  relMainReq: RelMainReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0
  };

  conceptReq: ConceptReq = {
    idCatalog: 0,
    idApplication: 1,
    idCompany: 1,
    createdBy: '',
    nomCatalog: ''
  }

  conceptRes: ConceptRes = {        
    codeStatus: '',
    codeDescription: ''
  }
  
  ngOnInit() {
    this.refreshApiTable();
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
  
  goRelations() {    
    this.router.navigate(['/relations']);
  }

  goConcepts(){

  }

  onSearch() {
    console.log('Listar Conceptos');
    this.conceptModelReq.idApplication = 1;
    this.conceptModelReq.idCompany = 1;
  
    this.conceptService.searchConcepts(this.conceptModelReq).subscribe({
    next: (response) => {
      if (response) {      
        Swal.fire({
          title: "Loading Information!",
          html: "Espere un momento.",
          timer: 1000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            clearInterval(2000);
          }
        }).then((result) => {          
          if (result.dismiss === Swal.DismissReason.timer) {                    
            this.listConcepts = response;                    
            console.log('Conceptos: ',this.listConcepts);
          }
        });
      } else {
        this.error = true; // Muestra error si la API devuelve `false`
      }
    },
      error: () => {
        this.error = true; // Muestra error si hay fallo en la petición              
      }
    });
	  setTimeout(() => {
		this.showResults = true;
	  }, 1000);
    
  }  

  refreshApiTable(){
    this.conceptModelReq.idApplication = 1;
    this.conceptModelReq.idCompany = 1;
    this.conceptService.searchConcepts(this.conceptModelReq).subscribe({
    next: (response) => {
      this.listConcepts = response;      
      this.listConceptsOriginal = response;      
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  onOpenSaveConcept() {    
    const modal = document.getElementById('modalSaveConcept');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateForm.value.conceptTxt = '';        
    this.validateForm.reset;
  }

  onCloseSaveConcept() {
    const modal = document.getElementById('modalSaveConcept');
    if(modal != null){
      modal.style.display = 'none';       
    }
    this.validateForm.value.conceptTxt = '';        
    this.validateForm.reset;
    const conceptId = document.getElementById('conceptId') as HTMLInputElement | null;
    if (conceptId !== null) {
      conceptId.value = '';
    }
  }

  onOpenUpdateConcept(item: any) {    
    console.log('Concepto a editar: ',item.nomCatalogRisk);
    console.log('Concepto a editar ID: ',item.idConceptRisk);
    const modal = document.getElementById('modalUpdateConcept');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateUpdForm.value.conceptUpdTxt = item.nomCatalogRisk;    
    this.validateUpdForm.value.conceptUpdIdTxt = item.idConceptRisk;

    const conceptUpdId = document.getElementById('conceptUpdIdTxt') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      conceptUpdId.value = item.idConceptRisk;
    }
    
    const conceptUpdNom = document.getElementById('conceptUpdId') as HTMLInputElement | null;
    if (conceptUpdNom !== null) {
      conceptUpdNom.value = item.nomCatalogRisk;    
    }

  }

  onCloseUpdateConcept() {
    const modal = document.getElementById('modalUpdateConcept');
    
    if(modal != null){
      modal.style.display = 'none';       
    }
    this.validateUpdForm.value.conceptUpdTxt = '';        
    this.validateUpdForm.value.conceptUpdIdTxt = '';
    this.validateUpdForm.reset;
    const conceptUpdId = document.getElementById('conceptUpdId') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      conceptUpdId.value = '';
    }
  }

  onOpenDeleteConcept(item: any) {    
    console.log('Concepto a eliminar: ',item.nomCatalogRisk);
    console.log('Concepto a eliminar ID: ',item.idConceptRisk);
    const modal = document.getElementById('modalDeleteConcept');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateDelForm.value.conceptUpdTxt = item.nomCatalogRisk;    
    this.validateDelForm.value.conceptUpdIdTxt = item.idConceptRisk;

    const conceptDelId = document.getElementById('conceptDelIdTxt') as HTMLInputElement | null;
    if (conceptDelId !== null) {
      conceptDelId.value = item.idConceptRisk;
    }
    
    const conceptDelNom = document.getElementById('conceptDelTxt') as HTMLInputElement | null;
    if (conceptDelNom !== null) {
      conceptDelNom.value = item.nomCatalogRisk;    
    }
  }

  onCloseDeleteConcept() {
    const modal = document.getElementById('modalDeleteConcept');
    if(modal != null){
      modal.style.display = 'none';       
    }
    this.validateDelForm.value.conceptDelTxt = '';        
    this.validateDelForm.reset;
    const conceptDelId = document.getElementById('conceptDelTxt') as HTMLInputElement | null;
    if (conceptDelId !== null) {
      conceptDelId.value = '';
    }
  }

  onSaveConcept(){
    console.log('guardando concepto: ', this.validateForm.value.conceptTxt);
    console.log('this.validateForm.valid: ',this.validateForm.valid);
    if
     (this.validateForm.valid) {
      this.conceptReq.idCatalog = 1;
      this.conceptReq.idApplication = 1;
      this.conceptReq.idCompany = 1;
      this.conceptReq.createdBy = 'jorge82lbs';
      this.conceptReq.nomCatalog = this.validateForm.value.conceptTxt;
      
      this.conceptService.saveConcept(this.conceptReq).subscribe({
            next: (responseSave) => {     
              console.log('Respuesta SAVE: ',responseSave);         
              this.conceptRes = responseSave;
              if (this.conceptRes.codeStatus == 'SUCCESS') {
                Swal.fire({
                    icon: "success",
                    title: "Conceptos",
                    text: "El Concepto fue almacenado satisfactoriamente",
                    footer: '<p>Concepto <strong>'+this.conceptReq.nomCatalog+'</strong> guardado con éxito</p>'
                  });
                  this.refreshApiTable();
                  this.onCloseSaveConcept();
              } else {
                Swal.fire({
                    icon: "error",
                    title: "No Satisfactorio",
                    text: 'Texto: '+this.conceptRes.codeDescription,
                    footer: '<p>Favor de validar con el Administrador</p>'
                  });
              }
            },
            error: () => {
                  Swal.fire({
                    icon: "error",
                    title: "No Satisfactorio",
                    text: this.conceptRes.codeDescription,
                    footer: '<p>'+this.error+'</p>'
                  });
              console.error('exception: ', this.error);
            }
          });	

    }else{
      Swal.fire({
        icon: "warning",
        title: "No Satisfactorio",
        text: "El Concepto es requerido",
        
      });
    }
  }

  onUpdateConcept(){
    console.log('actualizando concepto: ', this.validateUpdForm.value.conceptUpdTxt);                                           
    console.log('actualizando concepto ID: ', this.validateUpdForm.value.conceptUpdIdTxt);
    
    const conceptUpdId = document.getElementById('conceptUpdIdTxt') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      console.log('actualizando concepto ID (js): ', conceptUpdId.value);
      this.validateUpdForm.value.conceptUpdIdTxt = conceptUpdId.value
    }
    console.log('actualizando concepto ID(despues): ', this.validateUpdForm.value.conceptUpdIdTxt);
    console.log('this.validateUpdForm.valid: ',this.validateUpdForm.valid);
    if (this.validateUpdForm.valid) {
      this.conceptReq.idCatalog = Number(this.validateUpdForm.value.conceptUpdIdTxt);
      this.conceptReq.idApplication = 1;
      this.conceptReq.idCompany = 1;
      this.conceptReq.createdBy = 'jorge82lbs';
      this.conceptReq.nomCatalog = this.validateUpdForm.value.conceptUpdTxt;
      
      this.conceptService.updateConcept(this.conceptReq).subscribe({
            next: (response) => {     
              console.log('Respuesta Update: ',response);         
              this.conceptRes = response;
              if (this.conceptRes.codeStatus == 'SUCCESS') {
                Swal.fire({
                    icon: "success",
                    title: "Conceptos",
                    text: "El Concepto fue Actualizado satisfactoriamente",
                    footer: '<p>Concepto <strong>'+this.conceptReq.nomCatalog+'</strong> editado con éxito</p>'
                  });

                  this.refreshApiTable();
                  this.onCloseUpdateConcept();
                  
              } else {
                Swal.fire({
                    icon: "error",
                    title: "No Satisfactorio",
                    text: 'Texto: '+this.conceptRes.codeDescription,
                    footer: '<p>Favor de validar con el Administrador</p>'
                  });
              }
            },
            error: () => {
                  Swal.fire({
                    icon: "error",
                    title: "No Satisfactorio",
                    text: this.conceptRes.codeDescription,
                    footer: '<p>'+this.error+'</p>'
                  });
              console.error('exception: ', this.error);
            }
          });	

    }else{
      Swal.fire({
        icon: "warning",
        title: "No Satisfactorio",
        text: "El Concepto es requerido",
      });
    }
  }

  onDeleteConcept(){
    console.log('Eliminando concepto: ', this.validateDelForm.value.conceptDelTxt);
    console.log('Eliminando concepto ID: ', this.validateDelForm.value.conceptDelIdTxt);
    
    const conceptDelId = document.getElementById('conceptDelIdTxt') as HTMLInputElement | null;
    if (conceptDelId !== null) {
      console.log('eliminando concepto ID (js): ', conceptDelId.value);
      this.validateDelForm.value.conceptDelIdTxt = conceptDelId.value
    }
    console.log('eliminando concepto ID(despues): ', this.validateDelForm.value.conceptDelIdTxt);
    console.log('this.validateDelForm.valid: ',this.validateDelForm.valid);
    if (this.validateDelForm.valid) {
      this.conceptReq.idCatalog = Number(this.validateDelForm.value.conceptDelIdTxt);
      this.conceptReq.idApplication = 1;
      this.conceptReq.idCompany = 1;
      this.conceptReq.createdBy = 'jorge82lbs';
      this.conceptReq.nomCatalog = this.validateDelForm.value.conceptDelTxt;
      
      this.conceptService.deleteConcept(this.conceptReq).subscribe({
            next: (response) => {     
              console.log('Respuesta Delete: ',response);         
              this.conceptRes = response;
              if (this.conceptRes.codeStatus == 'SUCCESS') {
                Swal.fire({
                    icon: "success",
                    title: "Conceptos",
                    text: "El Concepto fue Eliminado satisfactoriamente",
                    footer: '<p>Concepto <strong>'+this.conceptReq.nomCatalog+'</strong> eliminado con éxito</p>'
                  });

                  this.refreshApiTable();
                  this.onCloseDeleteConcept();
                  
              } else {
                Swal.fire({
                    icon: "error",
                    title: "No Satisfactorio",
                    text: 'Texto: '+this.conceptRes.codeDescription,
                    footer: '<p>Favor de validar con el Administrador</p>'
                  });
              }
            },
            error: () => {
                  Swal.fire({
                    icon: "error",
                    title: "No Satisfactorio",
                    text: this.conceptRes.codeDescription,
                    footer: '<p>'+this.error+'</p>'
                  });
              console.error('exception: ', this.error);
            }
          });	

    }else{
      Swal.fire({
        icon: "warning",
        title: "No Satisfactorio",
        text: "El Concepto es requerido",
      });
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort) {
    
    const data = this.listConcepts.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomCatalog':
          return this.compare(a.nomCatalogRisk, b.nomCatalogRisk, isAsc);
        default:
          return 0;
      }
    });

    this.listConcepts = this.sortedData;
  }

  onSearchTable(event: Event, typeCol: number){
    const searchValue = (event.target as HTMLInputElement).value;
    this.listConcepts = this.listConceptsOriginal;
    const data = this.listConcepts.slice();
    
    switch (typeCol) {        
        case 6:          
          this.sortedData = data.filter(v => v.nomCatalogRisk.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1);
          this.listConcepts = this.sortedData;
          return;
        default:
          return 0;
      }        
  }

  onCloseSaveRelMain() {
    const modal = document.getElementById('modalSaveRelMain');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onOpenSaveRelMain(item: any){  

    this.relMainReq.idApplication = 1;
    this.relMainReq.idCompany = 1;
    this.relMainReq.idConceptRel = item.idConceptRisk;;
    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainResponse = response;
        console.log("Lista concept relacionables: ", this.listRelMainResponse);    
    },
      error: () => {
        this.error = true;
      }
    });	  


    const modal = document.getElementById('modalSaveRelMain');    
    if(modal != null){
      modal.style.display = 'block';              
    }    



  }

}
