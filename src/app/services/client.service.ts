import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClientListRes } from '../models/ClientListRes.model';
import { ClientListReq } from '../models/ClientListReq.model';
import { ClientDetListRes } from '../models/clients/ClientDetListRes.model';
import { ClientDetListReq } from '../models/clients/ClientDetListReq.model';
import { ClientDetCrudRes } from '../models/clients/ClientDetCrudRes.model';
import { ClientDetCrudReq } from '../models/clients/ClientDetCrudReq.model';


@Injectable({ providedIn: 'root' })

export class ClientService {
  
    private apiUrl = 'http://localhost:8084/api/clientPpld/getListClientsPpld'; 
    private apiUrlList = 'http://localhost:8084/api/clientPpld/getListClientsDet'; 
    private apiUrlCrud = 'http://localhost:8084/api/clientPpld/crudClientsPpld'; 

    constructor(private http: HttpClient) { }

    getListClient(clientListReq: ClientListReq): Observable<ClientListRes[]> {
      return this.http.post<ClientListRes[]>(this.apiUrl, clientListReq);
    }

    getListClientDet(clientDetListReq: ClientDetListReq): Observable<ClientDetListRes[]> {
      return this.http.post<ClientDetListRes[]>(this.apiUrlList, clientDetListReq);
    }

    crudClientDet(clientDetCrudReq: ClientDetCrudReq): Observable<ClientDetCrudRes> {
      return this.http.post<ClientDetCrudRes>(this.apiUrlCrud, clientDetCrudReq);
    }
    
}