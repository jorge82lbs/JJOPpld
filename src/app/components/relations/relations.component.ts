import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
declare const bootstrap: any; // Añade esto al inicio del archivo
import { ConceptModelRes } from '../../models/ConceptModelRes.model';
import { ConceptModelReq } from '../../models/ConceptModelReq.model';
import { RelationReq } from '../../models/RelationReq.model';
import { RelationRes } from '../../models/RelationRes.model';
import { RelConSelectReq } from '../../models/RelConSelectReq.model';
import { RelConSelectRes } from '../../models/RelConSelectRes.model';
import { ConceptService } from '../../services/concept.service';
import { RelationService } from '../../services/relation.service';
import { UmbralDetService } from '../../services/umbralDet.service';
import { FormsModule } from '@angular/forms';
import { RelationSelectReq } from '../../models/RelationSelectReq.model';
import { RelationSelectRes } from '../../models/RelationSelectRes.model';
import { UmbralDetReq } from '../../models/UmbralDetReq.model';
import { UmbralDetRes } from '../../models/UmbralDetRes.model';
import { UmDetSelectReq } from '../../models/UmDetSelectReq.model';
import { UmDetSelectRes } from '../../models/UmDetSelectRes.model';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-relations',
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    FormsModule
  ],
  templateUrl: './relations.component.html',
  styleUrl: './relations.component.css'
})
export class RelationsComponent implements OnInit {

constructor(
    private fb: FormBuilder,    
    private router: Router,
    private conceptService: ConceptService,
    private relationService: RelationService,
    private umbralDetService: UmbralDetService
  ) {
    this.sonForm = this.fb.group({
      
    });
    this.mainForm = this.fb.group({
      
    });
    this.umbralForm = this.fb.group({
      idRelationTxt: [],
      nomRuleTxt: [],
      rangoIniTxt: [],
      rangoFinTxt: [],
      groupRangeTxt: [],
      cantidadTxt: [],
      determinanteTxt: [],
      typeRuleTxt: [],
    });
  }

  relationSelectReq: RelationSelectReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0
  }

  umDetSelectReq: UmDetSelectReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
  }

  relationSelectRes: RelationSelectRes = {
    id: 0, 
    idRelation: 0,
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    nomConceptRel: "",
    idConcept: 0,
    nomConcept: "",
    indEstatus: "",
    fecCreationDate: new Date(), 
    fecLastUpdateDate: new Date(),
    createdBy: "",
    lastUpdatedBy: ""
  }

  umDetSelectRes: UmDetSelectRes = {
    id: 0,
    idUmbralDet: 0,
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0,
    idConcept: 0,
    nomConceptRel: "",
    nomConcept: "",
    idRelation: 0,
    typeRule: "",
    initialRange: 0,
    finalRange: 0,
    groupRange: "",
    numAmount: 0,
    determinant: 0,
    nomRule: "",
    indEstatus: "",
    fecCreationDate: new Date(), 
    fecLastUpdateDate: new Date(), 
    createdBy: "",
    lastUpdatedBy: ""
  }

  conceptModelReq: ConceptModelReq = {
    idApplication: 0,
    idCompany: 0 
  };
  relationModelReq: RelationReq = {
    idRelation: 0,
    idApplication: 0,
    idCompany: 0,
    idUser: 0, 
    operation: 0,   
    createdBy: '',
    lastUpdatedBy: '',
    conceptUp: 0,  
    conceptDown: 0
  };
  relationModelRes: RelationRes = {
    codeStatus: '',
    codeDescription: ''
  };
  relConSelectReq: RelConSelectReq = {
    idApplication: 0,
    idCompany: 0,
    idConceptRel: 0
  };
  relationRes: RelationRes = {        
      codeStatus: '',
      codeDescription: ''
  }
  umbralDetReq: UmbralDetReq = {
    umbralDet: 0,
    idRelation: 0,
    idTypeRule: '',
    initialRange: 0,
    finalRange: 0,
    groupRange: '',
    numAmount: 0,
    determinant: 0,
    nomRule: '',
    username: '',
    operation: 0,
  };
  umbralDetRes: UmbralDetRes = {        
      codeStatus: '',
      codeDescription: ''
  }

  listConcepts: ConceptModelRes[] = [];
  filteredOptions: ConceptModelRes[] = [];
  listRelConSelect: RelConSelectRes[] = [];
  listRelationSelect: RelationSelectRes[] = [];
  listUmDetSelect: UmDetSelectRes[] = [];
  selectedRows: any[] = [];
  sonForm: FormGroup;
  mainForm: FormGroup;
  umbralForm: FormGroup;
  mainConcept: ConceptModelRes = {
    id: 0,
    idConceptRisk: 0,
    idAplication: 0,
    idCompany: 0,
    nomCatalogRisk: "",
    indEstatus: "",
    fecCreationDate: new Date(),
    fecLastUpdateDate: new Date(),
    createdBy: "",
    lastUpdatedBy: ""
  };
  conceptRel: RelConSelectRes= {
    id: 0,
    idConceptRisk: 0,
    idApplication: 0,
    idCompany: 0,
    nomCatalogRisk: "",
    indEstatus: "",
    idConceptRel: 0
  };

  error = false;
  lbRangoType = false;
  lbValorType = false;
  lbMathType = false;
  selectedValue: string = 'Rango';

  idRelationTxt: string = '';
  nomRuleTxt: string = ''; 
  rangoIniTxt: string = ''; 
  rangoFinTxt: string = ''; 
  groupRangeTxt: string = ''; 
  cantidadTxt: string = ''; 
  determinanteTxt: string = ''; 
  typeRuleTxt: string = ''; 



  ngOnInit() {
    this.refreshApiTable();
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
  
  goRelations() {    
    
  }

  goConcepts(){
    this.router.navigate(['/concepts']);
  }

  onSelectRow(row: any) {
    console.log("Seleccionado: ", row.nomCatalogRisk);
    
  }

  onMainSelectionChange() {        
    console.log("(Main) Seleccionado ID: ", this.mainConcept.idConceptRisk);
    console.log("(Main) Seleccionado NOM: ", this.mainConcept.nomCatalogRisk);
    
  }

  onSelectionChange() {        
    console.log("Seleccionado ID: ", this.conceptRel.idConceptRisk);
    console.log("Seleccionado NOM: ", this.conceptRel.nomCatalogRisk);    
  }

  getConceptsInSelect(){
    this.relConSelectReq.idApplication = 1;
    this.relConSelectReq.idCompany = 1;
    this.relConSelectReq.idConceptRel = 1;
    this.relationService.searchRelConSelect(this.relConSelectReq).subscribe({
    next: (response) => {
      this.listRelConSelect = response;    
        console.log("Lista concept relacionables: ", this.listRelConSelect);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  getRelationsSelect(){
    this.relationSelectReq.idApplication = 1;
    this.relationSelectReq.idCompany = 1;
    this.relationSelectReq.idConceptRel = this.mainConcept.idConceptRisk;
    this.relationService.searchRelationSelect(this.relationSelectReq).subscribe({
    next: (response) => {
      this.listRelationSelect = response;     
      console.log("List Relation: ", this.listRelationSelect);
    },
      error: () => {
        this.error = true;
      }
    });	  
  }

  
   refreshApiTable(){
    this.conceptModelReq.idApplication = 1;
    this.conceptModelReq.idCompany = 1;
    this.conceptService.searchConcepts(this.conceptModelReq).subscribe({
    next: (response) => {
      this.listConcepts = response;  
      this.filteredOptions = response;  
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
    // Mostrar lista de conceptos que pueden ser hijos
    this.getConceptsInSelect();
  }

  onCloseSaveConcept() {
    const modal = document.getElementById('modalSaveRelation');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onSaveRelConcept(){
    console.log("(Main) Seleccionado ID: ", this.mainConcept.idConceptRisk);
    console.log("Seleccionado ID: ", this.conceptRel.idConceptRisk);    
    this.relationModelReq.idRelation = 0;
    this.relationModelReq.idApplication = 1;
    this.relationModelReq.idCompany = 1;
    this.relationModelReq.idUser = 1;
    this.relationModelReq.operation = 1;
    this.relationModelReq.createdBy = 'jorge82lbs';
    this.relationModelReq.lastUpdatedBy = 'jorge82lbs';
    this.relationModelReq.conceptUp = this.mainConcept.idConceptRisk;
    this.relationModelReq.conceptDown = this.conceptRel.idConceptRisk;

    this.relationService.crudRelation(this.relationModelReq, 1).subscribe({
      next: (responseSave) => {     
        console.log('Respuesta SAVE: ',responseSave);         
        this.relationRes = responseSave;
        if (this.relationRes.codeStatus == 'SUCCESS') {
          Swal.fire({
            icon: "success",
            title: "Conceptos",
            text: "El Concepto fue relacionado satisfactoriamente",
            footer: '<p>Concepto <strong>'+this.conceptRel.nomCatalogRisk+'</strong> guardado con éxito</p>'
          });    
          this.getRelationsSelect();
          this.onCloseSaveConcept();    
          
        } else {
          Swal.fire({
            icon: "error",
            title: "No Satisfactorio",
            text: 'Texto: '+this.relationRes.codeDescription,
            footer: '<p>Favor de validar con el Administrador</p>'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "No Satisfactorio",
          text: this.relationRes.codeDescription,
          footer: '<p>'+this.error+'</p>'
        });
        console.error('exception: ', this.error);
      }
    });	
  }

  onListRelConcept(){
    console.log("(Main) Seleccionado ID: ", this.mainConcept.idConceptRisk);

  }

  onOpenSaveRule(item: any){  
    const modal = document.getElementById('modalUmbral');    
    if(modal != null){
      modal.style.display = 'block';              
    }    

    const idRelationTmp = document.getElementById('idRelationTxt') as HTMLInputElement | null;
    if (idRelationTmp !== null) {      
      idRelationTmp.value = item.idRelation;
    }

  }

  onCloseSaveRule() {
    const modal = document.getElementById('modalUmbral');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onTypeRuleSelectionChange(newValue: any) {        
    this.selectedValue = newValue.target.value;
    console.log("Selected option changed to:", this.selectedValue);
    if(this.selectedValue == 'Rango'){
      this.lbRangoType = true; 
      this.lbValorType = false;
      this.lbMathType = false;
    }
    if(this.selectedValue == 'Valor'){
      this.lbRangoType = false; 
      this.lbValorType = true;
      this.lbMathType = false;
    }
    if(this.selectedValue == 'Suma' || this.selectedValue == 'Resta' ||
      this.selectedValue == 'Multiplicación' || this.selectedValue == 'División'
    ){
      this.lbRangoType = false; 
      this.lbValorType = false;
      this.lbMathType = true;
    }
    if(this.selectedValue == 'Seleccione...'){
      this.lbRangoType = false; 
      this.lbValorType = false;
      this.lbMathType = false;
    }

    this.umbralForm.value.typeRuleTxt = this.selectedValue;
    
    const ruleTypeTmp = document.getElementById('typeRuleTxt') as HTMLInputElement | null;
    if (ruleTypeTmp !== null) {      
      ruleTypeTmp.value = this.selectedValue;
    }
    
  }

  onSaveUmbral(){    
    const ruleTypeTmp = document.getElementById('typeRuleTxt') as HTMLInputElement | null;
    if (ruleTypeTmp !== null) {      
      this.umbralForm.value.typeRuleTxt = ruleTypeTmp.value;
    }
    
    const idRelationTmp = document.getElementById('idRelationTxt') as HTMLInputElement | null;
    if (idRelationTmp !== null) {      
      this.umbralDetReq.idRelation = Number(idRelationTmp.value);
    }

    this.umbralDetReq.umbralDet = 0;
    //this.umbralDetReq.idRelation = this.umbralForm.value.idRelationTxt;
    this.umbralDetReq.idTypeRule = this.umbralForm.value.typeRuleTxt;
    this.umbralDetReq.initialRange = this.umbralForm.value.rangoIniTxt == null ? 0 : this.umbralForm.value.rangoIniTxt;
    this.umbralDetReq.finalRange = this.umbralForm.value.rangoFinTxt == null ? 0 : this.umbralForm.value.rangoFinTxt;
    this.umbralDetReq.groupRange = this.umbralForm.value.groupRangeTxt;
    this.umbralDetReq.numAmount = this.umbralForm.value.cantidadTxt == null ? 0 : this.umbralForm.value.cantidadTxt;
    this.umbralDetReq.determinant = this.umbralForm.value.determinanteTxt == null ? 0 : this.umbralForm.value.determinanteTxt;
    this.umbralDetReq.nomRule = this.umbralForm.value.nomRuleTxt;
    this.umbralDetReq.username = 'jorge82lbs';
    this.umbralDetReq.operation = 1;
    
    console.log("--------------------------------------------------------------");
    console.log("this.umbralDetReq.idRelation:", this.umbralDetReq.idRelation);
    console.log("this.umbralDetReq.idTypeRule:", this.umbralDetReq.idTypeRule);
    console.log("this.umbralDetReq.initialRange:", this.umbralDetReq.initialRange);
    console.log("this.umbralDetReq.finalRange:", this.umbralDetReq.finalRange);
    console.log("this.umbralDetReq.groupRange:", this.umbralDetReq.groupRange);
    console.log("this.umbralDetReq.numAmount:", this.umbralDetReq.numAmount);
    console.log("this.umbralDetReq.determinant:", this.umbralDetReq.determinant);
    console.log("this.umbralDetReq.nomRule:", this.umbralDetReq.nomRule);

    this.umbralDetService.crudUmbral(this.umbralDetReq).subscribe({
      next: (response) => {     
        console.log('Respuesta: ',response);         
        this.umbralDetRes = response;
        if (this.umbralDetRes.codeStatus == 'SUCCESS') {
          Swal.fire({
            icon: "success",
            title: "Regla",
            text: "La regla fue asignada satisfactoriamente",
            footer: '<p>Regla <strong>' + this.umbralDetReq.nomRule + '</strong> guardado con éxito</p>'
          });    
          //this.getRelationsSelect();
          this.umbralForm.reset();
          this.onCloseSaveRule();    
          
        } else {
          Swal.fire({
            icon: "error",
            title: "No Satisfactorio",
            text: 'Texto: '+this.umbralDetRes.codeDescription,
            footer: '<p>Favor de validar con el Administrador</p>'
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "No Satisfactorio",
          text: this.umbralDetRes.codeDescription,
          footer: '<p>'+this.error+'</p>'
        });
        console.error('exception: ', this.error);
      }
    });	

  }


  onOpenViewRule(item: any){  
    const modal = document.getElementById('modalUmbralView');    
    if(modal != null){
      modal.style.display = 'block';              
    }    

    const idRelationTmp = document.getElementById('idRelationTxt') as HTMLInputElement | null;
    if (idRelationTmp !== null) {      
      idRelationTmp.value = item.idRelation;
    }

    this.umDetSelectReq.idApplication = 1;
    this.umDetSelectReq.idCompany = 1;
    this.umDetSelectReq.idConceptRel = this.mainConcept.idConceptRisk;
    this.umbralDetService.getUmbralDetail(this.umDetSelectReq).subscribe({
    next: (response) => {
      this.listUmDetSelect = response;    
        console.log("Lista reglas: ", this.listUmDetSelect);    
    },
      error: () => {
        this.error = true;
      }
    });	  

  }

  onCloseViewRule() {
    const modal = document.getElementById('modalUmbralView');
    if(modal != null){
      modal.style.display = 'none';       
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const filterValue = this.listConcepts.slice();
    
    this.filteredOptions = filterValue.filter(v => v.nomCatalogRisk.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1);    
  }
  

}
