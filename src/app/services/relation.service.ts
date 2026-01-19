import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelConSelectReq } from '../models/RelConSelectReq.model';
import { RelConSelectRes } from '../models/RelConSelectRes.model';
import { RelationReq } from '../models/RelationReq.model';
import { RelationRes } from '../models/RelationRes.model';
import { RelationSelectReq } from '../models/RelationSelectReq.model';
import { RelationSelectRes } from '../models/RelationSelectRes.model';
import { RelMainReq } from '../models/RelMainReq.model';
import { RelMainResponse } from '../models/RelMainResponse.model';

@Injectable({ providedIn: 'root' })

export class RelationService {
  
  private apiUrlCrud = 'http://localhost:8084/api/relation/crudRelation'; 
  private apiUrlCatSel = 'http://localhost:8084/api/relation/getListRelationCat'; 
  private apiUrlRelSel = 'http://localhost:8084/api/relation/getListRelation'; 
  private apiUrlRelMain = 'http://localhost:8084/api/relation/getListRelationMainCat'; 
  
  constructor(private http: HttpClient) { }

  searchRelConSelect(relConSelectReq: RelConSelectReq): Observable<RelConSelectRes[]> {
    return this.http.post<RelConSelectRes[]>(this.apiUrlCatSel, relConSelectReq);
  }

  crudRelation(relationReq: RelationReq, tsOperation: number): Observable<RelationRes> {
    return this.http.post<RelationRes>(this.apiUrlCrud, relationReq);
  }

  searchRelationSelect(relationSelectReq: RelationSelectReq): Observable<RelationSelectRes[]> {
    return this.http.post<RelationSelectRes[]>(this.apiUrlRelSel, relationSelectReq);
  }
  
  searchRelationMain(relMainReq: RelMainReq): Observable<RelMainResponse[]> {
    return this.http.post<RelMainResponse[]>(this.apiUrlRelMain, relMainReq);
  }

}