import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UmbralDetReq } from '../models/UmbralDetReq.model';
import { UmbralDetRes } from '../models/UmbralDetRes.model';
import { UmDetSelectReq } from '../models/UmDetSelectReq.model';
import { UmDetSelectRes } from '../models/UmDetSelectRes.model';

@Injectable({ providedIn: 'root' })

export class UmbralDetService {

    private apiUrlSave = 'http://localhost:8084/api/umbralDet/crudUmbralDet'; 
    private apiUrlSelect = 'http://localhost:8084/api/umbralDet/getListUmbralDet'; 

    constructor(private http: HttpClient) { }
    
    crudUmbral(umbralDetReq: UmbralDetReq): Observable<UmbralDetRes> {
        return this.http.post<UmbralDetRes>(this.apiUrlSave, umbralDetReq);
    }

    getUmbralDetail(umDetSelectReq: UmDetSelectReq): Observable<UmDetSelectRes[]> {
        return this.http.post<UmDetSelectRes[]>(this.apiUrlSelect, umDetSelectReq);
    }
    

}