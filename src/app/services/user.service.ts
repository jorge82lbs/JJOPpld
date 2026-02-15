import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserListRes } from '../models/users/UserListRes.model';
import { UserListReq } from '../models/users/UserListReq.model';
import { UserCrudRes } from '../models/users/UserCrudRes.model';
import { UserCrudReq } from '../models/users/UserCrudReq.model';


@Injectable({ providedIn: 'root' })

export class UserService {
  
    private apiUrlCrud = 'http://localhost:8084/api/users/crudUsers'; 
    private apiUrlList = 'http://localhost:8084/api/users/getListUsers'; 

    constructor(private http: HttpClient) { }

    crudUsers(userCrudReq: UserCrudReq): Observable<UserCrudRes> {
        return this.http.post<UserCrudRes>(this.apiUrlCrud, userCrudReq);
    }

    getListUsers(userListReq: UserListReq): Observable<UserListRes[]> {
        return this.http.post<UserListRes[]>(this.apiUrlList, userListReq);
    }


}