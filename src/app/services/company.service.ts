import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CompanyListRes } from '../models/company/CompanyListRes.model';
import { CompanyListReq } from '../models/company/CompanyListReq.model';
import { CompanyCrudRes } from '../models/company/CompanyCrudRes.model';
import { CompanyCrudReq } from '../models/company/CompanyCrudReq.model';


@Injectable({ providedIn: 'root' })

export class CompanyService {
  
    private apiUrlCrud = 'http://localhost:8084/api/company/crudCompanies'; 
    private apiUrlList = 'http://localhost:8084/api/company/getListCompanies'; 

    constructor(private http: HttpClient) { }

    crudCompany(companyCrudReq: CompanyCrudReq): Observable<CompanyCrudRes> {
        return this.http.post<CompanyCrudRes>(this.apiUrlCrud, companyCrudReq);
    }

    getListCompanies(companyListReq: CompanyListReq): Observable<CompanyListRes[]> {
        return this.http.post<CompanyListRes[]>(this.apiUrlList, companyListReq);
    }


}