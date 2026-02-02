import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ConceptsComponent } from './components/concepts/concepts.component';
import { RelationsComponent } from './components/relations/relations.component';
import { QualifyComponent } from './components/qualify/qualify.component';


export const routes: Routes = [
    { path: 'login', component:  LoginComponent, data: {title: 'login'} },    
    { path: 'concepts', component:  ConceptsComponent, data: {title: 'concepts'} },    
    { path: 'relations', component:  RelationsComponent, data: {title: 'relations'} },    
    { path: 'qualify', component:  QualifyComponent, data: {title: 'qualify'} },    
    { path: '**', pathMatch: 'full', redirectTo: 'login'},
];
