import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QualifyCrudReq } from '../models/QualifyCrudReq.model';
import { QualifyCrudRes } from '../models/QualifyCrudRes.model';
import { QualifyListReq } from '../models/QualifyListReq.model';
import { QualifyListRes } from '../models/QualifyListRes.model';

import { QualifyListMainReq } from '../models/QualifyListMainReq.model';
import { QualifyListMainRes } from '../models/QualifyListMainRes.model';

@Injectable({ providedIn: 'root' })

export class QualifyService {

    private apiUrlCrud = 'http://localhost:8084/api/qualifyfor/crudQualifyFor'; 
    private apiUrlList = 'http://localhost:8084/api/qualifyfor/getListQualifyFor'; 
    private apiUrlListMain = 'http://localhost:8084/api/qualifyfor/getListMainQualifyFor'; 


    constructor(private http: HttpClient) { }
    
    crudQualify(qualifyReq: QualifyCrudReq): Observable<QualifyCrudRes> {
        return this.http.post<QualifyCrudRes>(this.apiUrlCrud, qualifyReq);
    }

    getQualifyList(qualifyListReq: QualifyListReq): Observable<QualifyListRes[]> {
        return this.http.post<QualifyListRes[]>(this.apiUrlList, qualifyListReq);
    }

    getQualifyMainList(qualifyListMainReq: QualifyListMainReq): Observable<QualifyListMainRes[]> {
        return this.http.post<QualifyListMainRes[]>(this.apiUrlListMain, qualifyListMainReq);
    }

}