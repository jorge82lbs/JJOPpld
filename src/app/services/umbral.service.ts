import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UmbralReq } from '../models/UmbralReq.model';
import { UmbralRes } from '../models/UmbralRes.model';
import { UmbralListReq } from '../models/UmbralListReq.model';
import { UmbralListRes } from '../models/UmbralListRes.model';

@Injectable({ providedIn: 'root' })

export class UmbralService {

    private apiUrlCrud = 'http://localhost:8084/api/umbral/crudUmbral'; 
    private apiUrlList = 'http://localhost:8084/api/umbral/getListUmbral'; 

    constructor(private http: HttpClient) { }
    
    crudUmbral(umbralReq: UmbralReq): Observable<UmbralRes> {
        return this.http.post<UmbralRes>(this.apiUrlCrud, umbralReq);
    }

    getUmbralList(umbralListReq: UmbralListReq): Observable<UmbralListRes[]> {
        return this.http.post<UmbralListRes[]>(this.apiUrlList, umbralListReq);
    }
    

}