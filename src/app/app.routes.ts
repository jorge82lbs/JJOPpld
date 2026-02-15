import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ConceptsComponent } from './components/concepts/concepts.component';
import { RelationsComponent } from './components/relations/relations.component';
import { QualifyComponent } from './components/qualify/qualify.component';
import { ClientsComponent } from './components/clients/clients.component';
import { CompanyComponent } from './components/company/company.component';
import { UsersComponent } from './components/users/users.component';


export const routes: Routes = [
    { path: 'login', component:  LoginComponent, data: {title: 'login'} },    
    { path: 'concepts', component:  ConceptsComponent, data: {title: 'concepts'} },    
    { path: 'relations', component:  RelationsComponent, data: {title: 'relations'} },    
    { path: 'qualify', component:  QualifyComponent, data: {title: 'qualify'} },    
    { path: 'clients', component:  ClientsComponent, data: {title: 'clients'} },    
    { path: 'company', component:  CompanyComponent, data: {title: 'company'} },    
    { path: 'users', component:  UsersComponent, data: {title: 'users'} },    
    { path: '**', pathMatch: 'full', redirectTo: 'login'},
];
