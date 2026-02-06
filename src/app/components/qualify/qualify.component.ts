import { Component, 
         OnInit,
         afterRenderEffect,
         ChangeDetectionStrategy,
         computed,
         signal,
         viewChild,
         viewChildren
        } from '@angular/core';
import { FormBuilder, 
         FormGroup, 
         Validators, 
         ReactiveFormsModule
        } from '@angular/forms';        
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
declare const bootstrap: any; // Añade esto al inicio del archivo
import { Router } from '@angular/router';
import {Sort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

import { ConceptModelRes } from '../../models/ConceptModelRes.model';
import { ConceptModelReq } from '../../models/ConceptModelReq.model';
import { ConceptService } from '../../services/concept.service';

import { ClientListRes } from '../../models/ClientListRes.model';
import { ClientListReq } from '../../models/ClientListReq.model';
import { ClientService } from '../../services/client.service';

import { QualifyCrudReq } from '../../models/QualifyCrudReq.model';
import { QualifyCrudRes } from '../../models/QualifyCrudRes.model';
import { QualifyListReq } from '../../models/QualifyListReq.model';
import { QualifyListRes } from '../../models/QualifyListRes.model';
import { QualifyListMainReq } from '../../models/QualifyListMainReq.model';
import { QualifyListMainRes } from '../../models/QualifyListMainRes.model';
import { QualifyService } from '../../services/qualify.service';

import { UmbralReq } from '../../models/UmbralReq.model';
import { UmbralRes } from '../../models/UmbralRes.model';
import { UmbralListReq } from '../../models/UmbralListReq.model';
import { UmbralListRes } from '../../models/UmbralListRes.model';
import { UmbralService } from '../../services/umbral.service';

import { RelMainResponse } from '../../models/RelMainResponse.model';
import { RelMainReq } from '../../models/RelMainReq.model';

import Swal from 'sweetalert2';

import {Combobox, ComboboxInput, ComboboxPopupContainer} from '@angular/aria/combobox';
import {Listbox, Option} from '@angular/aria/listbox';
import {OverlayModule} from '@angular/cdk/overlay';


@Component({
  selector: 'app-qualify',
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    Combobox,
    ComboboxInput,
    ComboboxPopupContainer,
    Listbox,
    Option,
    MatSortModule,
    OverlayModule
  ],
  templateUrl: './qualify.component.html',
  styleUrl: './qualify.component.css',
})
export class QualifyComponent implements OnInit {
  listbox = viewChild<Listbox<string>>(Listbox);
  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);
  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);
  /** The query string used to filter the list of countries. */
  query = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,    
    private conceptService: ConceptService,
    private clientService: ClientService,    
    private qualifyService: QualifyService,
    private umbralService: UmbralService
  ) {
    this.clientForm = this.fb.group({
      
    });

    this.qtyForm = this.fb.group({
      conceptQtyTxt: [],
      idRelationQtyTxt: []
    });

  }   

  error = false;  
  showResults = false;
  sumaRiesgos: number = 0; 
  idClientGeneral: number = 0; 
  idRelationFather: number = 0; 
  idConceptFather: number = 0;
  conceptTxtMain: string = ''; 
  nomCatalogN2: string = ''; 
  conceptTxtIDMain: number = 0; 
  conceptTxtTitleID: number = 0; 
  clientForm: FormGroup;
  listConcepts: ConceptModelRes[] = [];
  listClients: ClientListRes[] = [];
  listRelMainNiv3: RelMainResponse[] = [];

  qtyForm: FormGroup;

  listConceptNivel1: QualifyListMainRes[] = [];
  sortedData: QualifyListMainRes[] = [];
  listRelMainNiv2: QualifyListRes[] = [];
  sortedDataN2: QualifyListRes[] = [];
  listUmbral: UmbralListRes[] = [];
  listUmbralOriginal: UmbralListRes[] = [];

  umbralListReq: UmbralListReq = {
    idApplication: 0,
    idCompany: 0
  };
  qualifyListRes: QualifyListRes = {
    id: 0,
    idQualify: 0,
    idClient:  0,
    numQualified: 0,
    nomConceptDown: '',
    idRelation: 0,    
    idApplication: 0,
    idCompany: 0, 
    idConceptRel: 0,
    nomConceptRel: '',
    idConcept: 0,
    nomConcept: '',
    indEstatus: '',
    indValue: 0,
    indNivel: 0
  }
  conceptModelReq: ConceptModelReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRisk: 0,
    isList: 0,
    nomConceptRisk: ""
  };

  qualifyCrudReq: QualifyCrudReq = {
    idQualifyFor: 0,
    idApplication: 0,
    idCompany: 0,
    idClient:  0,
    idRelationUp: 0,
    idRelation: 0,
    indValue: 0,
    username: '',
    operationType: 0,
  };

  qualifyCrudRes: QualifyCrudRes = {        
    codeStatus: '',
    codeDescription: ''
  }

  clientModelResponse: ClientListRes = {
    id: 0,   
    idClient: 0,
    idApplication: 0,
    idCompany: 0,
    indRfc: "",
    indDescription: "",
    indEstatus: ""
  };
  
  relMainReq: QualifyListMainReq = {
    idClient: 0,
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    operationType: 0,
    indNivel: 0
  };

  relMainReqN3: RelMainReq = {    
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    typeOperation: 0,
    indNivel: 0,
    attribute1: ''
  };

  qualifyListReq: QualifyListReq = {
    idClient: 0,
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    indNivel: 0,
    operationType: 0
  };    

  clientListReq: ClientListReq = {
    idClient: 0,
    idApplication: 0,
    idCompany: 0
  };  

  ngOnInit() {
    this.getInitialConcept(1, 1, 0, 0,'Soluciones Legales Integrales')
    this.getAllClients();
    this.getInitialUmbral(1,1);
    
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
  
  goConcepts(){
    this.router.navigate(['/concepts']);
  }

  getAllClients(){
    //console.log("(Main) getAllClients() ", );    
    this.clientListReq.idApplication = 1;
    this.clientListReq.idCompany = 1;
    this.clientListReq.idClient = 1;
    this.clientService.getListClient(this.clientListReq).subscribe({
    next: (response) => {
      this.listClients = response;  
      //console.log("(Main) this.listClients: ", this.listClients);

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

  getClientsSelect(){
    console.log("Se ejecuta esto? ");
  }

  onSelectionChangeClient(event: Event | string) {
    const value = typeof event === 'string' ? event : (event.target as HTMLSelectElement).value;
    //console.log('Selected value is:', value);
    this.idClientGeneral = Number(value);
    this.getInitialRelation(this.idClientGeneral, 1, 1, 1, 1, 1);
    this.listRelMainNiv2.length = 0;
    this.nomCatalogN2 = '';
  }

  getInitialRelation(pIdClient: number,
                     pIdApplication: number,
                     pIdCompany: number,
                     pIdConceptRel: number,
                     pTypeOperation: number,
                     pIndNivel: number
                     ){
    this.relMainReq.idClient = pIdClient;
    this.relMainReq.idApplication = pIdApplication;
    this.relMainReq.idCompany = pIdCompany;
    this.relMainReq.idConceptRel = pIdConceptRel;
    this.relMainReq.operationType = pTypeOperation;
    this.relMainReq.indNivel = pIndNivel;
    
    this.qualifyService.getQualifyMainList(this.relMainReq).subscribe({
    next: (response) => {
      this.listConceptNivel1 = response;
      //console.log("Lista concept N1: ", this.listConceptNivel1);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  onOpenNivel2Popup(item: any){
    //console.log("(Nivel 2) item.idApplication: ", item.idApplication);    
    //console.log("(Nivel 2) item.idCompany: ", item.idCompany);    
    //console.log("(Nivel 2) item.idConceptRel: ", item.idConcept);    
    //console.log("(Nivel 2) item.nomCatalogRisk: ", item.nomCatalogRisk);    
    this.nomCatalogN2 = item.nomCatalogRisk;
    this.qualifyListReq.idClient = this.idClientGeneral;
    this.qualifyListReq.idApplication = item.idApplication;
    this.qualifyListReq.idCompany = item.idCompany;
    this.qualifyListReq.idConceptRel = item.idConcept;    
    this.qualifyListReq.indNivel = 2;
    this.qualifyListReq.operationType = 1;
    
    this.qualifyService.getQualifyList(this.qualifyListReq).subscribe({
    next: (response) => {
      this.listRelMainNiv2 = response;      
      //console.log("Lista concept N2: ", this.listRelMainNiv2);    
    },
      error: () => {
        this.error = true;
      }
    });	  

    
  }

  onOpenNivel3Popup(item: any){  
    //console.log("(Nivel 3) item.idRelation: ", item.idRelation);    
    //console.log("(Nivel 3) item.idApplication: ", item.idApplication);    
    //console.log("(Nivel 3) item.idCompany: ", item.idCompany);    
    //console.log("(Nivel 3) item.idConcept: ", item.idConcept);    
    //console.log("(Nivel 3) item.idConceptRel: ", item.idConceptRel);    
    //console.log("(Nivel 3) item.nomCatalog: ", item.nomConcept);
    this.idRelationFather = Number(item.idRelation);
    this.idConceptFather = Number(item.idConceptRel);
    this.qtyForm.value.conceptQtyTxt = item.nomConcept;
    
    const valueQty = document.getElementById('conceptQtyTxtHtml') as HTMLInputElement | null;
    if (valueQty !== null) {
      valueQty.value = item.nomConcept;  
    }

    const modal = document.getElementById('modalQty');    
    if(modal != null){
      modal.style.display = 'block';              
    }

    this.relMainReqN3.typeOperation = 1;
    this.relMainReqN3.attribute1 = '';
    if(item.nomConcept == 'MUNICIPIO DE RESIDENCIA'){
      //console.log("(Nivel 3) buscar el Estado que esta seleccionado");
      //console.log("(Nivel 3) ",this.listRelMainNiv2);
      const encontrado = this.listRelMainNiv2.find(p => p.nomConcept === 'ESTADO DE RESIDENCIA')?.nomConceptDown;
      //console.log("(Nivel 3) encontrado: ", encontrado); 
      this.relMainReqN3.typeOperation = 4;
      this.relMainReqN3.attribute1 = String(encontrado);

    }

    this.relMainReqN3.idApplication = item.idApplication;
    this.relMainReqN3.idCompany = item.idCompany;
    this.relMainReqN3.idConceptRel = item.idConcept;
    
    this.relMainReqN3.indNivel = 3;
    
    this.conceptService.searchRelationMain(this.relMainReqN3).subscribe({
    next: (response) => {
      this.listRelMainNiv3 = response;      
      //console.log("Lista concept N4: ", this.listRelMainNiv3);    
      if(item.nomConcept == 'MUNICIPIO DE RESIDENCIA'){
        this.listRelMainNiv3.sort((a, b) => a.nomCatalogRisk.localeCompare(b.nomCatalogRisk));  
      }else{
        this.listRelMainNiv3.sort((a, b) => a.indValue - b.indValue);  
      }
      

    },
      error: () => {
        this.error = true;
      }
    });	  

  }

  onQtyAction(){
    //console.log('this.qtyForm.idRelationQtyTxt:',this.qtyForm.value.idRelationQtyTxt);
    //console.log('idClient:', this.idClientGeneral); 
    //console.log('idRelation (Padre):', this.idRelationFather);
    
    this.qualifyCrudReq.idQualifyFor = 0;
    this.qualifyCrudReq.idApplication = 1;
    this.qualifyCrudReq.idCompany = 1;
    this.qualifyCrudReq.idClient = this.idClientGeneral;
    this.qualifyCrudReq.idRelationUp = this.idRelationFather;
    this.qualifyCrudReq.idRelation = this.qtyForm.value.idRelationQtyTxt;
    this.qualifyCrudReq.indValue = 0;
    this.qualifyCrudReq.username = 'jlbautistas';
    this.qualifyCrudReq.operationType = 1;
  
    this.qualifyService.crudQualify(this.qualifyCrudReq).subscribe({    
      next: (responseSave) => {     
        //console.log('(Main) Respuesta DELETE: ',responseSave);         
        this.qualifyCrudRes = responseSave;
        if (this.qualifyCrudRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Calificación",
              text: "La calificación fue registrada satisfactoriamente",
              footer: '<p>Concepto <strong>'+this.qualifyCrudRes.codeStatus+'</strong> </p>'
            });
            //this.getInitialRelation(1, 1, 1, 1, 1);
            this.getInitialRelation(this.idClientGeneral, 1, 1, 1, 1, 1);
            this.refreshListNivel2(this.idClientGeneral, 1, 1, this.idConceptFather);
            this.onCloseQtyAction();
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.qualifyCrudRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.qualifyCrudRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('exception: ', this.error);
      }
    });	  
      
  }

  onCloseQtyAction(){    
    const modal = document.getElementById('modalQty');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onSelectionChangeQty(event: Event | string) {
    const value = typeof event === 'string' ? event : (event.target as HTMLSelectElement).value;
    //console.log('idRelation:', value);    
    
  }

  refreshListNivel2(liIdClient: number, liIdApplication: number, liIdCompany: number, liIdConcept: number){
    this.qualifyListReq.idClient = liIdClient;
    this.qualifyListReq.idApplication = liIdApplication;
    this.qualifyListReq.idCompany = liIdCompany;
    this.qualifyListReq.idConceptRel = liIdConcept;    
    this.qualifyListReq.indNivel = 2;
    this.qualifyListReq.operationType = 1;
    
    this.qualifyService.getQualifyList(this.qualifyListReq).subscribe({
    next: (response) => {
      this.listRelMainNiv2 = response;      
      //console.log("Lista concept N2: ", this.listRelMainNiv2);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  get totalRisk() {
    return this.listConceptNivel1.reduce((acc, item) => acc + item.catCalif, 0).toFixed(2);;
  }
  get totalPorcent() {
    return this.listConceptNivel1.reduce((acc, item) => acc + item.indValue, 0);
  }

  get totalRiskDescription() {
    let returnDesc = '';
    let i = 0;
    let ini = 0;
    let fin = 0;
    let leyenda = '';
    let flagStop = false;
    let currentRisk = this.listConceptNivel1.reduce((acc, item) => acc + item.catCalif, 0);
    do{
      ini = this.listUmbral[i].numInitial;
      fin = this.listUmbral[i].numFinal;
      leyenda = this.listUmbral[i].indImpact;
      if(currentRisk > ini && currentRisk < fin){
        returnDesc = leyenda;
        flagStop = true;
      }
      i++;

    } while (flagStop == false && i < this.listUmbral.length);


    return returnDesc;
  }

  getColorClass(){
    let returnColor = '';
    let i = 0;
    let ini = 0;
    let fin = 0;    
    let flagStop = false;
    let currentRisk = this.listConceptNivel1.reduce((acc, item) => acc + item.catCalif, 0);
    do{
      ini = this.listUmbral[i].numInitial;
      fin = this.listUmbral[i].numFinal;      
      returnColor = this.listUmbral[i].indColor;      
      if(currentRisk > ini && currentRisk < fin){
        flagStop = true;
      }
      i++;
      //console.log("i: ",i);
    } while (flagStop == false && i < this.listUmbral.length);
        
    //console.log("returnColor: ",returnColor);
    return returnColor;
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

compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortDataUmbralCl(sort: Sort) {
    
    const data = this.listConceptNivel1.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'gpo':
          return this.compare(a.nomCatalogRisk, b.nomCatalogRisk, isAsc);
        case 'valor':
          return this.compare(a.indValue, b.indValue, isAsc);
        case 'calif':
          return this.compare(a.catCalif, b.catCalif, isAsc);
        default:
          return 0;
      }
    });

    this.listConceptNivel1 = this.sortedData;
  }

  sortDataN2Cl(sort: Sort) {
    
    const data = this.listRelMainNiv2.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedDataN2 = data;
      return;
    }

    this.sortedDataN2 = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomCl':
          return this.compare(a.nomConcept, b.nomConcept, isAsc);
        case 'valCl':
          return this.compare(a.numQualified, b.numQualified, isAsc);
        default:
          return 0;
      }
    });

    this.listRelMainNiv2 = this.sortedDataN2;
    
  }

}
