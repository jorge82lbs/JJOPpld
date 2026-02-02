import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClientListRes } from '../models/ClientListRes.model';
import { ClientListReq } from '../models/ClientListReq.model';


@Injectable({ providedIn: 'root' })

export class ClientService {
  
    private apiUrl = 'http://localhost:8084/api/clientPpld/getListClientsPpld'; 

    constructor(private http: HttpClient) { }

    getListClient(clientListReq: ClientListReq): Observable<ClientListRes[]> {
      return this.http.post<ClientListRes[]>(this.apiUrl, clientListReq);
    }
    
}