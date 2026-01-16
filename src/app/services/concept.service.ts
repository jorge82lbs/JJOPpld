import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConceptModelRes } from '../models/ConceptModelRes.model';
import { ConceptModelReq } from '../models/ConceptModelReq.model';
import { ConceptReq } from '../models/ConceptReq.model';
import { ConceptRes } from '../models/ConceptRes.model';

@Injectable({ providedIn: 'root' })

export class ConceptService {
  
  private apiUrl = 'http://localhost:8084/api/catalog/getListCatalog'; 

  private apiUrlSave = 'http://localhost:8084/api/catalog/saveCatalog'; 
  private apiUrlUpdate = 'http://localhost:8084/api/catalog/updateCatalog'; 
  private apiUrlDelete = 'http://localhost:8084/api/catalog/deleteCatalog'; 
  
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

}