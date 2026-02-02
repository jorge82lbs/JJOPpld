import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConceptModelRes } from '../models/ConceptModelRes.model';
import { ConceptModelReq } from '../models/ConceptModelReq.model';
import { ConceptReq } from '../models/ConceptReq.model';
import { ConceptRes } from '../models/ConceptRes.model';
import { RelMainReq } from '../models/RelMainReq.model';
import { RelMainResponse } from '../models/RelMainResponse.model';
import { ConceptRelReq } from '../models/ConceptRelReq.model';

@Injectable({ providedIn: 'root' })

export class ConceptService {
  
  private apiUrl = 'http://localhost:8084/api/catalog/getListCatalog'; 

  private apiUrlSave = 'http://localhost:8084/api/catalog/saveCatalog'; 
  private apiUrlUpdate = 'http://localhost:8084/api/catalog/updateCatalog'; 
  private apiUrlDelete = 'http://localhost:8084/api/catalog/deleteCatalog'; 
  private apiUrlRelMain = 'http://localhost:8084/api/relation/getListRelationMainCat'; 
  private apiUrlCrudCR = 'http://localhost:8084/api/catalog/crudConceptRel'; 

  private apiUrlUpload = 'http://localhost:8084/api/catalog/upload'; 
  
  constructor(private http: HttpClient) { }

  searchConcepts(conceptModelReq: ConceptModelReq): Observable<ConceptModelRes[]> {
    return this.http.post<ConceptModelRes[]>(this.apiUrl, conceptModelReq);
  }

  saveConcept(conceptReq: ConceptReq): Observable<ConceptRes> {
    return this.http.post<ConceptRes>(this.apiUrlSave, conceptReq);
  }

  updateConcept(conceptReq: ConceptReq): Observable<ConceptRes> {
    return this.http.post<ConceptRes>(this.apiUrlUpdate, conceptReq);
  }

  deleteConcept(conceptReq: ConceptReq): Observable<ConceptRes> {
    return this.http.post<ConceptRes>(this.apiUrlDelete, conceptReq);
  }

  searchRelationMain(relMainReq: RelMainReq): Observable<RelMainResponse[]> {
    return this.http.post<RelMainResponse[]>(this.apiUrlRelMain, relMainReq);
  }

  crudConceptRel(conceptRelReq: ConceptRelReq): Observable<ConceptRes> {
    return this.http.post<ConceptRes>(this.apiUrlCrudCR, conceptRelReq);
  }

  upload(file: File, 
        idConceptUp: number,
        idApplication: number,
        idCompany: number,
        username: string,        
        idConceptDown: number,
        idRelation: number,        
        indNivel: number,
        operationType: number,
        attUpload: number
        ): Observable<ConceptModelRes> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idConceptUp', idConceptUp.toString());
    formData.append('idApplication', idApplication.toString());
    formData.append('idCompany', idCompany.toString());
    formData.append('username', username);    
    formData.append('idConceptDown', idConceptDown.toString());
    formData.append('idRelation', idRelation.toString());
    formData.append('indNivel', indNivel.toString());
    formData.append('operationType', operationType.toString());
    formData.append('attribute1', attUpload.toString());
    
    return this.http.post<ConceptModelRes>(this.apiUrlUpload, formData);
  }
  
}