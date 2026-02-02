import { Component, ElementRef, ViewChild, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
declare const bootstrap: any; // Añade esto al inicio del archivo
import { Router } from '@angular/router';
import { ConceptService } from '../../services/concept.service';
import { UmbralService } from '../../services/umbral.service';

import { ConceptModelRes } from '../../models/ConceptModelRes.model';
import { ConceptModelReq } from '../../models/ConceptModelReq.model';
import { ConceptReq } from '../../models/ConceptReq.model';
import { ConceptRes } from '../../models/ConceptRes.model';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RelMainReq } from '../../models/RelMainReq.model';
import { RelMainResponse } from '../../models/RelMainResponse.model';
import { ConceptRelReq } from '../../models/ConceptRelReq.model';
import { UmbralReq } from '../../models/UmbralReq.model';
import { UmbralRes } from '../../models/UmbralRes.model';
import { UmbralListReq } from '../../models/UmbralListReq.model';
import { UmbralListRes } from '../../models/UmbralListRes.model';


import Swal from 'sweetalert2';


@Component({
  selector: 'app-concepts.component',
  imports: [
    FormsModule,
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
  selectedFile: File | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private conceptService: ConceptService,
    private umbralService: UmbralService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
    this.validateForm = this.fb.group({
      conceptTxt: ['', Validators.required]
    });
    this.validateUpdForm = this.fb.group({
      conceptUpdTxt: ['', Validators.required],
      conceptUpdIdTxt: [],
      valorUpdTxt: []
    });
    this.validateUpdFormN2 = this.fb.group({
      conceptUpdN2Txt: ['', Validators.required],
      conceptUpdIdN2Txt: [],
      valorUpdN2Txt: []
    });
    this.validateUpdFormN3 = this.fb.group({
      conceptUpdN3Txt: ['', Validators.required],
      conceptUpdIdN3Txt: [],
      valorUpdN3Txt: []
    });
    this.validateDelForm = this.fb.group({
      conceptDelTxt: [],
      conceptDelIdTxt: []
    });

    this.sonForm = this.fb.group({
      valueTxt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      conceptTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
    });

    this.umbralForm = this.fb.group({
      impactTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      probabilityTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      rangeIniTxt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      rangeFinTxt: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    });

    this.umbralUpdForm = this.fb.group({
      impactUpdTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      probabilityUpdTxt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      rangeIniUpdTxt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      rangeFinUpdTxt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      umbralUpdIdTxt: ['', [Validators.required, Validators.pattern('[0-9]*')]]
    });

    this.sonFormN2 = this.fb.group({
      valueN2Txt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      conceptN2Txt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
    });

    this.sonFormN3 = this.fb.group({
      valueN3Txt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      conceptN3Txt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
    });

    this.sortedData = this.listConcepts.slice();    

  }    

  conceptModelReq: ConceptModelReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRisk: 0,
    isList: 0,
    nomConceptRisk: ""
  };

  listConcepts: ConceptModelRes[] = [];
  sortedData: ConceptModelRes[] = [];
  listConceptsOriginal: ConceptModelRes[] = [];
  listRelMainResponse: RelMainResponse[] = [];
  listRelMainNiv2: RelMainResponse[] = [];
  listRelMainNiv2Org: RelMainResponse[] = [];
  listRelMainNiv3: RelMainResponse[] = [];
  listRelMainNiv3Org: RelMainResponse[] = [];
  listUmbral: UmbralListRes[] = [];
  listUmbralOriginal: UmbralListRes[] = [];

  relMainFilterN2: RelMainResponse[] = [];
  relMainFilterN3: RelMainResponse[] = [];
  relMainFilter: RelMainResponse[] = [];
  listRelMainOriginal: RelMainResponse[] = [];
  
  heroes: string = ''; 
  error = false;
  showResults = false;
  conceptTxt: string = ''; 
  conceptUpdTxt: string = ''; 
  conceptUpdIdTxt: string = ''; 
  conceptDelTxt: string = ''; 
  conceptDelIdTxt: string = ''; 
  validateForm: FormGroup;
  validateUpdForm: FormGroup;
  validateUpdFormN2: FormGroup;
  validateUpdFormN3: FormGroup;
  validateDelForm: FormGroup;
  sonForm: FormGroup;
  sonFormN2: FormGroup;
  sonFormN3: FormGroup;
  umbralForm: FormGroup;
  umbralUpdForm: FormGroup;
  conceptTxtTitle: string = ''; 
  conceptTxtTitleID: number = 0; 
  conceptTxtTitleN3: string = ''; 
  conceptTxtTitleIDN3: number = 0; 
  conceptTxtMain: string = ''; 
  conceptTxtIDMain: number = 0; 
  selectedRows: any[] = [];
  isChecked: boolean = false;
  attUpload: number = 0; 

  conceptNivel1: RelMainResponse = {
    id: 0,
	  idConceptRisk: 0,
    idRelation: 0,
    nomCatalogRisk: "",
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    nomConceptRel: "",
    idConcept: 0,
    indEstatus: "",
    indValue: 0,
    indNivel: 0
  }

  umbralReq: UmbralReq = {
    idUmbral: 0,
    idApplication: 0,
    idCompany: 0,
    numInitial: 0,
    numFinal: 0,
    indProbability: '',
    indImpact: '',
    username: '',
    operationType: 0
  }

  relMainReq: RelMainReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    typeOperation: 0,
    indNivel: 0,
    attribute1: ''
  };

  umbralListReq: UmbralListReq = {
    idApplication: 0,
    idCompany: 0
  };

  conceptReq: ConceptReq = {
    idCatalog: 0,
    idApplication: 1,
    idCompany: 1,
    createdBy: '',
    nomCatalog: ''
  }

  conceptRelReq: ConceptRelReq = {
    idConceptUp: 0,
    idApplication: 0,
    idCompany: 0,
    username: '',
    nomCatalog: '',
    idConceptDown: 0,
    idRelation: 0,
    indValue: 0,
    indNivel: 0,
    operationType: 0,
    attribute1: ''
  }

  conceptRes: ConceptRes = {        
    codeStatus: '',
    codeDescription: ''
  }

  umbralRes: UmbralRes = {        
    codeStatus: '',
    codeDescription: ''
  }
  
  ngOnInit() {
    // this.refreshApiTable();    
    this.getInitialConcept(1, 1, 0, 0,'Soluciones Legales Integrales')
    this.getInitialRelation(1, 1, 1, 1, 1);
    this.getInitialUmbral(1, 1);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
  
  goQualify() {    
    this.router.navigate(['/qualify']);
  }

  goConcepts(){

  }

  onSearch() {
    
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
            //console.log('Conceptos: ',this.listConcepts);
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
    const modal = document.getElementById('modalSaveRelation');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateForm.value.conceptTxt = '';        
    this.validateForm.reset;
  }

  onCloseSaveConcept() {
    const modal = document.getElementById('modalSaveRelation');
    if(modal != null){
      modal.style.display = 'none';       
    }
  } 

  onOpenUpdateConcept(item: any) {    
    //console.log('(Main) Relación a editar: ',item.nomCatalogRisk);
    //console.log('(Main) Relacion editar ID: ',item.idRelation);
    //console.log('(Main) Valor editar ID: ',item.indValue);

    const modal = document.getElementById('modalUpdateConcept');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateUpdForm.value.conceptUpdTxt = item.nomCatalogRisk;    
    this.validateUpdForm.value.conceptUpdIdTxt = item.idConceptRisk;

    const conceptUpdId = document.getElementById('conceptUpdIdTxt') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      conceptUpdId.value = item.idRelation;
    }
    
    const conceptUpdNom = document.getElementById('conceptUpdId') as HTMLInputElement | null;
    if (conceptUpdNom !== null) {
      conceptUpdNom.value = item.nomCatalogRisk;    
    }
    
    const valueUpdNom = document.getElementById('valorUpdId') as HTMLInputElement | null;
    if (valueUpdNom !== null) {
      valueUpdNom.value = item.indValue;    
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
    //console.log('(Main) Concepto a eliminar: ',item.idRelation);
    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = item.nomCatalogRisk;
    this.conceptRelReq.idConceptDown = 0;
    this.conceptRelReq.idRelation = item.idRelation;
    this.conceptRelReq.indValue = item.idRelation;
    this.conceptRelReq.indNivel = 2;
    this.conceptRelReq.operationType = 2;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
          next: (responseSave) => {     
            //console.log('(Main) Respuesta DELETE: ',responseSave);         
            this.conceptRes = responseSave;
            if (this.conceptRes.codeStatus == 'SUCCESS') {
              Swal.fire({
                  icon: "success",
                  title: "Conceptos",
                  text: "La relación de concepto fue eliminada satisfactoriamente",
                  footer: '<p>Concepto <strong>'+item.nomCatalogRisk+'</strong> </p>'
                });
                this.getInitialRelation(1, 1, 1, 1, 1);
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
  }

  onOpenDeleteConceptN2(item: any) {    
    //console.log('-->Concepto a eliminar: ',item.idRelation);
    //console.log('Actualizar con ID: ',this.conceptTxtTitleID);
    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = item.nomCatalogRisk;
    this.conceptRelReq.idConceptDown = 0;
    this.conceptRelReq.idRelation = item.idRelation; // Para este proceso, este id es el importante
    this.conceptRelReq.indValue = 0;
    this.conceptRelReq.indNivel = 2;
    this.conceptRelReq.operationType = 2;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
          next: (responseSave) => {     
            //console.log('Respuesta DELETE: ',responseSave);         
            this.conceptRes = responseSave;
            if (this.conceptRes.codeStatus == 'SUCCESS') {
              Swal.fire({
                  icon: "success",
                  title: "Conceptos",
                  text: "La relación de concepto fue eliminada satisfactoriamente",
                  footer: '<p>Concepto <strong>'+item.nomCatalogRisk+'</strong> </p>'
                });
                //this.refreshApiTable();
                //this.onCloseSaveConcept();                
                this.getInitialRelationNiv2(1, 1, this.conceptTxtTitleID, 1, 2);
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
  }

  onUpdateConcept(){
    //console.log('(Main) actualizando Valor: ', this.validateUpdForm.value.valorUpdTxt);                                           
    //console.log('(Main) actualizando con ID: ', this.validateUpdForm.value.conceptUpdIdTxt);
    
    const conceptUpdId = document.getElementById('conceptUpdIdTxt') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      //console.log('(Main) actualizando concepto ID (js): ', conceptUpdId.value);
      this.conceptRelReq.idRelation = Number(conceptUpdId.value);
    }
    
    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = "";
    this.conceptRelReq.idConceptDown = 0;    
    this.conceptRelReq.indValue = this.validateUpdForm.value.valorUpdTxt;
    this.conceptRelReq.indNivel = 2;
    this.conceptRelReq.operationType = 3;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {     
        //console.log('(Main) Respuesta Update: ',responseSave);         
        this.conceptRes = responseSave;
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue modificado satisfactoriamente",
              footer: '<p>Concepto guardado con éxito</p>'
            });
            this.onCloseUpdateConcept();
            this.getInitialRelation(1, 1, 1, 1, 1);
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
        console.error('(Main) exception: ', this.error);
      }
    });	
    
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

  onClosePopupN2() {
    const modal = document.getElementById('modalPopupN2');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onCloseSaveRelMainN3() {
    const modal = document.getElementById('modalPopupN3');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onOpenNivel2Popup(item: any){  
    //console.log("item.idApplication: ", item.idApplication);    
    //console.log("item.idCompany: ", item.idCompany);    
    //console.log("item.idConceptRel: ", item.idConcept);    
    //console.log("item.nomCatalogRisk: ", item.nomCatalogRisk);    
    

    this.conceptTxtTitle = item.nomCatalogRisk;
    this.conceptTxtTitleID = item.idConcept;

    this.relMainReq.idApplication = item.idApplication;
    this.relMainReq.idCompany = item.idCompany;
    this.relMainReq.idConceptRel = item.idConcept;
    this.relMainReq.typeOperation = 1;
    this.relMainReq.indNivel = 2;
    this.relMainReq.attribute1 = '';
    
    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainNiv2 = response;
      this.listRelMainNiv2Org = response;
      //console.log("Lista concept N2: ", this.listRelMainNiv2);    
    },
      error: () => {
        this.error = true;
      }
    });	  


    const modal = document.getElementById('modalPopupN2');    
    if(modal != null){
      modal.style.display = 'block';              
    }    

  }

  onSearchTableRel(event: Event, typeCol: number){
    const searchValue = (event.target as HTMLInputElement).value;
    this.listRelMainResponse = this.listRelMainOriginal;
    this.relMainFilter = this.listRelMainResponse;
    const data = this.relMainFilter.slice();
    
    switch (typeCol) {        
        case 6:          
          this.relMainFilter = data.filter(v => v.nomCatalogRisk.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1);
          this.listRelMainResponse = this.relMainFilter;
          return;
        default:
          return 0;
    }        
  }

  onSearchTableRelN2(event: Event, typeCol: number){
    const searchValue = (event.target as HTMLInputElement).value;
    this.listRelMainNiv2 = this.listRelMainNiv2Org;
    this.relMainFilterN2 = this.listRelMainNiv2;
    const data = this.relMainFilterN2.slice();
    
    switch (typeCol) {
        case 6:          
          this.relMainFilterN2 = data.filter(v => v.nomCatalogRisk.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1);
          this.listRelMainNiv2 = this.relMainFilterN2;
          return;
        default:
          return 0;
    }        
  }

  isSelected(item: any): boolean {
    return this.selectedRows.some(r => r.id === item.id);
  }

  onSelectRow(row: any) {
    const index = this.selectedRows.findIndex(r => r.id === row.id);   
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }

    //console.log('this.selectedRows:',this.selectedRows);
    
  }

  
  refreshApiNivelTable(value: number){
    this.relMainReq.idApplication = 1;
    this.relMainReq.idCompany = 1;
    this.relMainReq.idConceptRel = 1;
    this.relMainReq.typeOperation = 3;
    this.relMainReq.indNivel = value;

    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainResponse = response;            
      //console.log("Lista nivel 1: ", this.listRelMainResponse);    
    },
      error: () => {
        this.error = true;
      }
    });	  
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
      this.conceptTxtMain = this.listConcepts[0].nomCatalogRisk;
      this.conceptTxtIDMain = this.listConcepts[0].idConceptRisk;
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  getInitialRelation(pIdApplication: number,
                     pIdCompany: number,
                     pIdConceptRel: number,
                     pTypeOperation: number,
                     pIndNivel: number
                     ){
    this.relMainReq.idApplication = pIdApplication;
    this.relMainReq.idCompany = pIdCompany;
    this.relMainReq.idConceptRel = pIdConceptRel;
    this.relMainReq.typeOperation = pTypeOperation;
    this.relMainReq.indNivel = pIndNivel;
    
    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainResponse = response;
      this.listRelMainOriginal = response;
      //console.log("Lista concept relacionables: ", this.listRelMainResponse);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  getInitialUmbral(pIdApplication: number,
                   pIdCompany: number
                  ){
    this.umbralListReq.idApplication = pIdApplication;
    this.umbralListReq.idCompany = pIdCompany;
    
    this.umbralService.getUmbralList(this.umbralListReq).subscribe({
    next: (response) => {
      this.listUmbral = response;
      this.listUmbralOriginal = response;
      //console.log("this.listUmbral: ", this.listUmbral);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  onSaveRelConcept(){
    //console.log("(Main) Concepto: ", this.sonForm.value.conceptTxt);   
    //console.log("(Main) Valor: ", this.sonForm.value.valueTxt); 

    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = this.sonForm.value.conceptTxt;
    this.conceptRelReq.idConceptDown = 0;
    this.conceptRelReq.idRelation = 0;
    this.conceptRelReq.indValue = this.sonForm.value.valueTxt;
    this.conceptRelReq.indNivel = 1;
    this.conceptRelReq.operationType = 1;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {     
        //console.log('(Main) Respuesta SAVE: ',responseSave);         
        this.conceptRes = responseSave;
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue almacenado satisfactoriamente",
              footer: '<p>Concepto <strong>'+this.sonForm.value.conceptTxt+'</strong> guardado con éxito</p>'
            });
            //this.refreshApiTable();
            this.onCloseSaveConcept();
            this.getInitialRelation(1, 1, 1, 1, 1);
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
        console.error('(Main) exception: ', this.error);
      }
    });	

  }  

  onSaveRelConceptN2(){

    //console.log("(Popup) Concepto: ", this.sonFormN2.value.conceptN2Txt);   
    //console.log("(Popup) Valor: ", this.sonFormN2.value.valueN2Txt); 

    this.conceptRelReq.idConceptUp = this.conceptTxtTitleID;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = this.sonFormN2.value.conceptN2Txt;
    this.conceptRelReq.idConceptDown = 0;
    this.conceptRelReq.idRelation = 0;
    this.conceptRelReq.indValue = this.sonFormN2.value.valueN2Txt;
    this.conceptRelReq.indNivel = 2;
    this.conceptRelReq.operationType = 1;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {     
        //console.log('Respuesta SAVE: ',responseSave);         
        this.conceptRes = responseSave;
        //console.log('Respuesta SAVE: ',this.conceptRes.codeStatus);         
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue almacenado satisfactoriamente",
              footer: '<p>Concepto <strong>'+this.sonFormN2.value.conceptN2Txt+'</strong> guardado con éxito</p>'
            });            
            //this.onCloseSaveRelMain();
            this.onCloseSaveRelMainAlta();
            this.getInitialRelationNiv2(1, 1, this.conceptTxtTitleID, 1, 2);
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


  }

  onSaveRelConceptN3(){
    console.log("(Popup) Alta nivel 3: ");
    console.log("(Popup) Concepto: ", this.sonFormN3.value.conceptN3Txt);
    console.log("(Popup) Valor: ", this.sonFormN3.value.valueN3Txt); 
    console.log("(Popup) idConceptUp: ", this.conceptTxtTitleIDN3); 

    this.conceptRelReq.idConceptUp = this.conceptTxtTitleIDN3;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = this.sonFormN3.value.conceptN3Txt;
    this.conceptRelReq.idConceptDown = 0;
    this.conceptRelReq.idRelation = 0;
    this.conceptRelReq.indValue = this.sonFormN3.value.valueN3Txt;
    this.conceptRelReq.indNivel = 3;
    this.conceptRelReq.operationType = 1;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {     
        //console.log('Respuesta SAVE_N4: ',responseSave);         
        this.conceptRes = responseSave;
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue almacenado satisfactoriamente",
              footer: '<p>Concepto <strong>'+this.sonForm.value.conceptTxt+'</strong> guardado con éxito</p>'
            });            
            //this.onCloseSaveRelMain();
            this.onCloseSaveRelMainAltaN3();                 
            this.getInitialRelationNiv3(1, 1, this.conceptTxtTitleIDN3, 1, 3);
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

  }

  getInitialRelationNiv2(pIdApplication: number,
                         pIdCompany: number,
                         pIdConceptRel: number,
                         pTypeOperation: number,
                         pIndNivel: number
                        ){
    this.relMainReq.idApplication = pIdApplication;
    this.relMainReq.idCompany = pIdCompany;
    this.relMainReq.idConceptRel = pIdConceptRel;
    this.relMainReq.typeOperation = pTypeOperation;
    this.relMainReq.indNivel = pIndNivel;
    
    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainNiv2 = response;      
      //console.log("Lista listRelMainNiv2: ", this.listRelMainNiv2);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

onOpenUpdateConceptN2(item: any) {            
    //console.log('N2 Relación a editar: ',item.nomCatalogRisk);
    //console.log('N2 Relacion editar ID: ',item.idRelation);
    //console.log('N2 Valor editar ID: ',item.indValue);

    const modal = document.getElementById('modalUpdateConceptN2');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateUpdFormN2.value.conceptUpdN2Txt = item.nomCatalogRisk;    
    this.validateUpdFormN2.value.conceptUpdIdN2Txt = item.idConceptRisk;

    const conceptUpdId = document.getElementById('conceptUpdIdTxtN2') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      conceptUpdId.value = item.idRelation;
    }
    
    const conceptUpdNom = document.getElementById('conceptUpdIdN2') as HTMLInputElement | null;
    if (conceptUpdNom !== null) {
      conceptUpdNom.value = item.nomCatalogRisk;    
    }
    //valorUpdTxt
    const valueUpdNom = document.getElementById('valorUpdIdN2') as HTMLInputElement | null;
    if (valueUpdNom !== null) {
      valueUpdNom.value = item.indValue;    
    }    

  }

  onCloseUpdateConceptN2() {
    const modal = document.getElementById('modalUpdateConceptN2');
    
    if(modal != null){
      modal.style.display = 'none';       
    }    
  }

  
  onUpdateConceptN2(){
    //console.log('N2 actualizando Valor: ', this.validateUpdFormN2.value.valorUpdN2Txt);
    //console.log('N2 actualizando con ID: ', this.validateUpdFormN2.value.conceptUpdIdN2Txt);
    
    const conceptUpdId = document.getElementById('conceptUpdIdTxtN2') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      //console.log('N2 actualizando concepto ID (js): ', conceptUpdId.value);
      this.conceptRelReq.idRelation = Number(conceptUpdId.value);
    }
    
    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = "";
    this.conceptRelReq.idConceptDown = 0;    
    this.conceptRelReq.indValue = this.validateUpdFormN2.value.valorUpdN2Txt;
    this.conceptRelReq.indNivel = 2;
    this.conceptRelReq.operationType = 3;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {     
        //console.log('Respuesta Update: ',responseSave);         
        this.conceptRes = responseSave;
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue modificado satisfactoriamente",
              footer: '<p>Concepto guardado con éxito</p>'
            });
            //this.refreshApiTable();
            this.onCloseUpdateConceptN2();
            this.getInitialRelationNiv2(1, 1, this.conceptTxtTitleID, 1, 2);
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
    
  }

  onCloseSaveRelMainAlta() {
    const modal = document.getElementById('modalSaveRelMainAlta');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onOpenSaveConceptN2(){
    const modal = document.getElementById('modalSaveRelMainAlta');    
    if(modal != null){
      modal.style.display = 'block';              
    }    
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onFileSelectedN2(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onFileSelectedN3(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      //this.conceptService.upload(this.selectedFile).subscribe(heroes => this.heroes = heroes);
      //console.log('heroes: ', this.heroes);
      this.conceptService.upload(this.selectedFile, 
                                 1,
                                 1,
                                 1,
                                 'jlbautistas',
                                 0,
                                 0,
                                 1,
                                 1,
                                 0
                                ).subscribe({
        next: (responseUpload) => {     
          //console.log('Respuesta uPLOAD: ', responseUpload);
          this.getInitialRelation(1, 1, 1, 1, 1);
          //this.conceptRes = responseSave;
          //if (this.conceptRes.codeStatus == 'SUCCESS') {
            Swal.fire({
                icon: "success",
                title: "Conceptos",
                text: "El Archivo fue Cargado Satisfactoriamente",
                footer: '<p>Success</p>'
              });                        
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
    }

  }

  onUploadN2() {
    if (this.selectedFile) {
      //this.conceptService.upload(this.selectedFile).subscribe(heroes => this.heroes = heroes);
      //console.log('heroes: ', this.conceptTxtTitleID);
      this.conceptService.upload(this.selectedFile, 
                                 this.conceptTxtTitleID,
                                 1,
                                 1,
                                 'jlbautistas',
                                 0,
                                 0,
                                 2,
                                 1,0
                                ).subscribe({
        next: (responseUpload) => {     
          //console.log('Respuesta uPLOAD: ', responseUpload);
          this.getInitialRelationNiv2(1, 1, this.conceptTxtTitleID, 1, 2);
          //this.conceptRes = responseSave;
          //if (this.conceptRes.codeStatus == 'SUCCESS') {
            Swal.fire({
                icon: "success",
                title: "Conceptos",
                text: "El Archivo fue Cargado Satisfactoriamente",
                footer: '<p>Success</p>'
              });                        
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
    }

  }

  onOpenNivel3Popup(item: any){  
    //console.log("item.idApplication: ", item.idApplication);    
    //console.log("item.idCompany: ", item.idCompany);    
    //console.log("item.idConceptRel: ", item.idConcept);    
    //console.log("item.nomCatalogRisk: ", item.nomCatalogRisk);    
    

    this.conceptTxtTitleN3 = item.nomCatalogRisk;
    this.conceptTxtTitleIDN3 = item.idConcept;

    this.relMainReq.idApplication = item.idApplication;
    this.relMainReq.idCompany = item.idCompany;
    this.relMainReq.idConceptRel = item.idConcept;
    this.relMainReq.typeOperation = 1;
    this.relMainReq.indNivel = 3;
    
    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainNiv3 = response;
      this.listRelMainNiv3Org = response;
      //console.log("Lista concept N4: ", this.listRelMainNiv3);    
    },
      error: () => {
        this.error = true;
      }
    });	  


    const modal = document.getElementById('modalPopupN3');    
    if(modal != null){
      modal.style.display = 'block';              
    }    

  }

  onUploadN3() {
    console.log('isChecked: ', this.isChecked);
    if(this.isChecked == true){
      this.attUpload = 1; 
    }
    else{
      this.attUpload = 0; 
    }
    if (this.selectedFile) {            
      this.conceptService.upload(this.selectedFile, 
                                 this.conceptTxtTitleIDN3,
                                 1,
                                 1,
                                 'jlbautistas',
                                 0,
                                 0,
                                 3,
                                 1,this.attUpload
                                ).subscribe({
        next: (responseUpload) => {     
          //console.log('Respuesta uPLOAD: ', responseUpload);
          //this.conceptRes = responseSave;
          //if (this.conceptRes.codeStatus == 'SUCCESS') {
          this.getInitialRelationNiv3(1, 1, this.conceptTxtTitleIDN3, 1, 3);
            Swal.fire({
                icon: "success",
                title: "Conceptos",
                text: "El Archivo fue Cargado Satisfactoriamente",
                footer: '<p>Success</p>'
              });                        
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
    }

  }

  getInitialRelationNiv3(pIdApplication: number,
                         pIdCompany: number,
                         pIdConceptRel: number,
                         pTypeOperation: number,
                         pIndNivel: number
                        ){
    this.relMainReq.idApplication = pIdApplication;
    this.relMainReq.idCompany = pIdCompany;
    this.relMainReq.idConceptRel = pIdConceptRel;
    this.relMainReq.typeOperation = pTypeOperation;
    this.relMainReq.indNivel = pIndNivel;
    
    this.conceptService.searchRelationMain(this.relMainReq).subscribe({
    next: (response) => {
      this.listRelMainNiv3 = response;      
      //console.log("Lista listRelMainNiv3: ", this.listRelMainNiv3);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  onOpenSaveConceptN3(){
    const modal = document.getElementById('modalSaveRelMainAltaN3');    
    if(modal != null){
      modal.style.display = 'block';              
    }    
  }

  onSearchTableRelN3(event: Event, typeCol: number){
    const searchValue = (event.target as HTMLInputElement).value;
    this.listRelMainNiv3 = this.listRelMainNiv3Org;
    this.relMainFilterN3 = this.listRelMainNiv3;
    const data = this.relMainFilterN3.slice();
    
    switch (typeCol) {
        case 6:          
          this.relMainFilterN3 = data.filter(v => v.nomCatalogRisk.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1);
          this.listRelMainNiv3 = this.relMainFilterN3;
          return;
        default:
          return 0;
    }        
  }

  onOpenUpdateConceptN3(item: any) {            
    //console.log('N3 Relación a editar: ',item.nomCatalogRisk);
    //console.log('N3 Relacion editar ID: ',item.idRelation);
    //console.log('N3 Valor editar ID: ',item.indValue);

    const modal = document.getElementById('modalUpdateConceptN3');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.validateUpdFormN3.value.conceptUpdN3Txt = item.nomCatalogRisk;    
    this.validateUpdFormN3.value.conceptUpdIdN3Txt = item.idConceptRisk;

    const conceptUpdId = document.getElementById('conceptUpdIdTxtN3') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      conceptUpdId.value = item.idRelation;
    }
    
    const conceptUpdNom = document.getElementById('conceptUpdIdN3') as HTMLInputElement | null;
    if (conceptUpdNom !== null) {
      conceptUpdNom.value = item.nomCatalogRisk;    
    }
    //valorUpdTxt
    const valueUpdNom = document.getElementById('valorUpdIdN3') as HTMLInputElement | null;
    if (valueUpdNom !== null) {
      valueUpdNom.value = item.indValue;    
    }    

  }

  onCloseUpdateConceptN3() {
    const modal = document.getElementById('modalUpdateConceptN3');
    
    if(modal != null){
      modal.style.display = 'none';       
    }    
  }

  onOpenDeleteConceptN3(item: any) {    
    //console.log('N3 -->Concepto a eliminar: ',item.idRelation);
    //console.log('N3 Actualizar con ID: ',this.conceptTxtTitleID);
    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = item.nomCatalogRisk;
    this.conceptRelReq.idConceptDown = 0;
    this.conceptRelReq.idRelation = item.idRelation;
    this.conceptRelReq.indValue = 0;
    this.conceptRelReq.indNivel = 3;
    this.conceptRelReq.operationType = 2;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {             
        this.conceptRes = responseSave;
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "La relación de concepto fue eliminada satisfactoriamente",
              footer: '<p>Concepto <strong>'+item.nomCatalogRisk+'</strong> </p>'
            });
            this.getInitialRelationNiv3(1, 1, this.conceptTxtTitleIDN3, 1, 3);
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
  }

  onUpdateConceptN3(){
    //console.log('N3 actualizando Valor: ', this.validateUpdFormN3.value.valorUpdN3Txt);
    //console.log('N3 actualizando con ID: ', this.validateUpdFormN3.value.conceptUpdIdN3Txt);
                                                 
    
    const conceptUpdId = document.getElementById('conceptUpdIdTxtN3') as HTMLInputElement | null;
    if (conceptUpdId !== null) {
      //console.log('N3 actualizando concepto ID (js): ', conceptUpdId.value);
      this.conceptRelReq.idRelation = Number(conceptUpdId.value);
    }
    
    this.conceptRelReq.idConceptUp = 1;
    this.conceptRelReq.idApplication = 1;
    this.conceptRelReq.idCompany = 1;
    this.conceptRelReq.username = 'jlbautistas';
    this.conceptRelReq.nomCatalog = "";
    this.conceptRelReq.idConceptDown = 0;    
    this.conceptRelReq.indValue = this.validateUpdFormN3.value.valorUpdN3Txt;
    this.conceptRelReq.indNivel = 3;
    this.conceptRelReq.operationType = 3;
    
    this.conceptService.crudConceptRel(this.conceptRelReq).subscribe({
      next: (responseSave) => {     
        //console.log('N3 Respuesta Update: ',responseSave);         
        this.conceptRes = responseSave;
        if (this.conceptRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue modificado satisfactoriamente",
              footer: '<p>Concepto guardado con éxito</p>'
            });
            //this.refreshApiTable();
            this.onCloseUpdateConceptN3();
            this.getInitialRelationNiv3(1, 1, this.conceptTxtTitleIDN3, 1, 3);
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
    
  }

  onCloseSaveRelMainAltaN3() {
    const modal = document.getElementById('modalSaveRelMainAltaN3');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onOpenSaveUmbral() {
    const modal = document.getElementById('modalSaveUmbral');
    if(modal != null){
      modal.style.display = 'block';              
    }
  }

  onCloseSaveUmbral() {
    const modal = document.getElementById('modalSaveUmbral');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onCloseUpdateUmbral() {
    const modal = document.getElementById('modalUpdateUmbral');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onSaveUmbralAction(){
    //console.log("(Alta Umbral) impactTxt: ", this.umbralForm.value.impactTxt);   
    //console.log("(Alta Umbral) probabilityTxt: ", this.umbralForm.value.probabilityTxt); 
    //console.log("(Alta Umbral) rangeIniTxt: ", this.umbralForm.value.rangeIniTxt);   
    //console.log("(Alta Umbral) rangeFinTxt: ", this.umbralForm.value.rangeFinTxt);   

    this.umbralReq.idUmbral = 0;
    this.umbralReq.idApplication = 1;
    this.umbralReq.idCompany = 1;
    this.umbralReq.numInitial = Number(this.umbralForm.value.rangeIniTxt);
    this.umbralReq.numFinal = Number(this.umbralForm.value.rangeFinTxt);
    this.umbralReq.indProbability = this.umbralForm.value.probabilityTxt;
    this.umbralReq.indImpact = this.umbralForm.value.impactTxt;
    this.umbralReq.username = 'jlbautistas';
    this.umbralReq.operationType = 1;
    
    this.umbralService.crudUmbral(this.umbralReq).subscribe({
      next: (responseSave) => {     
        //console.log('(Alta Umbral) Respuesta: ',responseSave);         
        this.umbralRes = responseSave;
        if (this.umbralRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Umbral",
              text: "Información almacenada satisfactoriamente",
              footer: '<p> <strong>'+this.umbralForm.value.impactTxt+'</strong> guardado con éxito</p>'
            });
            this.onCloseSaveUmbral();
            this.getInitialUmbral(1, 1);
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.umbralRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.umbralRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('(Main) exception: ', this.error);
      }
    });	

  }
   
  onUpdateUmbralAction(){
    
    this.umbralReq.idUmbral = Number(this.umbralUpdForm.value.umbralUpdIdTxt);
    this.umbralReq.idApplication = 1;
    this.umbralReq.idCompany = 1;
    this.umbralReq.numInitial = Number(this.umbralUpdForm.value.rangeIniUpdTxt);
    this.umbralReq.numFinal = Number(this.umbralUpdForm.value.rangeFinUpdTxt);
    this.umbralReq.indProbability = this.umbralUpdForm.value.probabilityUpdTxt;
    this.umbralReq.indImpact = this.umbralUpdForm.value.impactUpdTxt;
    this.umbralReq.username = 'jlbautistas';
    this.umbralReq.operationType = 2;
    
    const updId = document.getElementById('umbralUpdIdTxt') as HTMLInputElement | null;
    if (updId !== null) {
      //console.log("(Update Umbral Action) ID(js): ", updId.value);   
      this.umbralReq.idUmbral = Number(updId.value);
    }

    this.umbralService.crudUmbral(this.umbralReq).subscribe({
      next: (responseSave) => {     
        //console.log('(Update Umbral) Respuesta: ',responseSave);         
        this.umbralRes = responseSave;
        if (this.umbralRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Umbral",
              text: "Información almacenada satisfactoriamente",
              footer: '<p> <strong>'+this.umbralUpdForm.value.impactTxt+'</strong> guardado con éxito</p>'
            });
            this.onCloseUpdateUmbral();
            this.getInitialUmbral(1, 1);
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.umbralRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.umbralRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('(Main) exception: ', this.error);
      }
    });	

  }

onOpenUpdateUmbral(item: any) {    
    //console.log('(Update Umbral) Impacto: ',item.indImpact);
    //console.log('(Update Umbral) Probabilidad: ',item.indProbabilty);
    //console.log('(Update Umbral) Rango inicial: ',item.numInitial);
    //console.log('(Update Umbral) Rango final: ',item.numFinal);
    //console.log('(Update Umbral) ID: ',item.idUmbral);    
    
    this.umbralUpdForm.value.impactUpdTxt = item.indImpact;    
    this.umbralUpdForm.value.probabilityUpdTxt = item.indProbabilty;
    this.umbralUpdForm.value.rangeIniUpdTxt = item.numInitial;
    this.umbralUpdForm.value.rangeFinUpdTxt = item.numFinal;

    const umbralUpdId = document.getElementById('umbralUpdIdTxt') as HTMLInputElement | null;
    if (umbralUpdId !== null) {
      umbralUpdId.value = item.idUmbral;
    }
    
    const probabilityUpd = document.getElementById('probabilityUpdTxtHtml') as HTMLInputElement | null;
    if (probabilityUpd !== null) {
      probabilityUpd.value = item.indProbabilty;    
    }

    const impactUpd = document.getElementById('impactUpdTxtHtml') as HTMLInputElement | null;
    if (impactUpd !== null) {
      impactUpd.value = item.indImpact;    
    }
    
    const rangeIniUpd = document.getElementById('rangeIniUpdTxtHtml') as HTMLInputElement | null;
    if (rangeIniUpd !== null) {
      rangeIniUpd.value = item.numInitial;    
    }

    const rangeFinUpd = document.getElementById('rangeFinUpdTxtHtml') as HTMLInputElement | null;
    if (rangeFinUpd !== null) {
      rangeFinUpd.value = item.numFinal;    
    }

    const modal = document.getElementById('modalUpdateUmbral');    
    if(modal != null){
      modal.style.display = 'block';              
    }    

  }  

  onOpenDeleteUmbral(item: any) {    
    
    this.umbralReq.idUmbral = Number(item.idUmbral);
    this.umbralReq.idApplication = 1;
    this.umbralReq.idCompany = 1;
    this.umbralReq.numInitial = 0;
    this.umbralReq.numFinal = 0;
    this.umbralReq.indProbability = '';
    this.umbralReq.indImpact = '';
    this.umbralReq.username = 'jlbautistas';
    this.umbralReq.operationType = 3;
    
    
    this.umbralService.crudUmbral(this.umbralReq).subscribe({
      next: (responseSave) => {             
        this.umbralRes = responseSave;
        if (this.umbralRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Umbral",
              text: "Información almacenada satisfactoriamente",
              footer: '<p> <strong>'+item.indImpact+'</strong> eliminado con éxito</p>'
            });
            this.onCloseUpdateUmbral();
            this.getInitialUmbral(1, 1);
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.umbralRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.umbralRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('(Main) exception: ', this.error);
      }
    });	
    
  }

}
