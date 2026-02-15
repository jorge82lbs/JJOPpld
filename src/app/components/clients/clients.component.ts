import { Component, OnInit } from '@angular/core';
import { DatePipe,formatDate  } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- Añade esto
import { Sort, MatSortModule } from '@angular/material/sort';

import { ClientService } from '../../services/client.service';
import { ClientDetListReq } from '../../models/clients/ClientDetListReq.model';
import { ClientDetListRes } from '../../models/clients/ClientDetListRes.model';
import { ClientDetCrudReq } from '../../models/clients/ClientDetCrudReq.model';
import { ClientDetCrudRes } from '../../models/clients/ClientDetCrudRes.model';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-clients',  
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSortModule,
    DatePipe
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})

export class ClientsComponent implements OnInit {
  searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,    
    private clientService: ClientService
    ) {
      this.searchForm = this.fb.group({
        searchTerm: ['']
    });
    

    this.clientForm = this.fb.group({
      htmlDocDate: [],
      htmlFirName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlSecName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlNames: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlNatty: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlCouBir: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBirDate: [],
      htmlEcoAct: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlRfc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddStrt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddNum: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddSubb: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddCp: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddCity: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddTown: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddState: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlPhoneNum: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlPhoneExt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlPhoneSmt: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlCountry: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlCurp: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlIdOf: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlIdName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlIdAut: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlForeign: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFstreet: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFnumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFsuburb: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFcity: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFstate: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFcp: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFcoun: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBcont: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBcDoc: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFullName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlSign: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBenef: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
    });

    this.clientFormUpd = this.fb.group({
      htmlDocDateUpd: [],
      htmlFirNameUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlSecNameUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlNamesUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlNattyUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlCouBirUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBirDateUpd: [],
      htmlEcoActUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlRfcUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddStrtUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddNumUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddSubbUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddCpUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddCityUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddTownUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlAddStateUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlPhoneNumUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlPhoneExtUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlPhoneSmtUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlCountryUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlCurpUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlEmailUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlIdOfUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlIdNameUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlIdAutUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlForeignUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFstreetUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFnumberUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFsuburbUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFcityUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFstateUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFcpUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFcounUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBcontUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBcDocUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlFullNameUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlSignUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]],
      htmlBenefUpd: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]]
    });
  
  }

  loggedUser: string = '';
  conceptTxtMain: string = ''; 
  conceptTxtIDMain: string = ''; 
  fechaActual: string = ''; 
  todayDate: string = ''; 

  error = false;

  clientForm: FormGroup;
  clientFormUpd: FormGroup;

  

  clientDetListReq: ClientDetListReq = {
    idClient: 0,
    idApplication: 0,
    idCompany: 0,      
    operationType: 0

  };

  clientDetCrudRes: ClientDetCrudRes = {        
      codeStatus: '',
      codeDescription: ''
    }

  clientDetCrudReq: ClientDetCrudReq = {
    idClient: 0,
    idApplication: 0,
    idCompany: 0,
    fecDocumentDate: new Date(),
    indFirstName: '',
    indSecondName: '',
    indNames: '',
    indNationality: '',
    indCountryBirth: '',
    fecBirthDate: new Date(),
    indEconomicAct: '',
    indRfc: '',
    indAddressStreet: '',
    indAddressNum: '',
    indAddressSuburb: '',
    indAddressCp: '',
    indAddressCity: '',
    indAddressTown: '',
    indAddressState: '',
    indPhoneNumber: '',
    indPhoneExt: '',
    indPhoneSmart: '',
    indCountry: '',
    indCurp: '',
    indEmail: '',
    indIdOficial: '',
    indIdName: '',
    indIdAuthority: '',
    indForeign: '',
    indFstreet: '',
    indFnumber: '',
    indFsuburb: '',
    indFcity: '',
    indFstate: '',
    indFcp: '',
    indFcountry: '',
    indBcontroller: '',
    indBcDoc: '',
    operationType: 0,
    createdBy: '',
    indEstatus: '',
    username: '',
}

  listClients: ClientDetListRes[] = [];
  listClientsOrg: ClientDetListRes[] = [];
  listAllCountries = [
{ countryCode: 'Afghanistan', countryName: 'Afghanistan' },
{ countryCode: 'Albania', countryName: 'Albania' },
{ countryCode: 'Algeria', countryName: 'Algeria' },
{ countryCode: 'Andorra', countryName: 'Andorra' },
{ countryCode: 'Angola', countryName: 'Angola' },
{ countryCode: 'Antigua and Barbuda', countryName: 'Antigua and Barbuda' },
{ countryCode: 'Argentina', countryName: 'Argentina' },
{ countryCode: 'Armenia', countryName: 'Armenia' },
{ countryCode: 'Australia', countryName: 'Australia' },
{ countryCode: 'Austria', countryName: 'Austria' },
{ countryCode: 'Azerbaijan', countryName: 'Azerbaijan' },
{ countryCode: 'Bahamas', countryName: 'Bahamas' },
{ countryCode: 'Bahrain', countryName: 'Bahrain' },
{ countryCode: 'Bangladesh', countryName: 'Bangladesh' },
{ countryCode: 'Barbados', countryName: 'Barbados' },
{ countryCode: 'Belarus', countryName: 'Belarus' },
{ countryCode: 'Belgium', countryName: 'Belgium' },
{ countryCode: 'Belize', countryName: 'Belize' },
{ countryCode: 'Benin', countryName: 'Benin' },
{ countryCode: 'Bhutan', countryName: 'Bhutan' },
{ countryCode: 'Bolivia', countryName: 'Bolivia' },
{ countryCode: 'Bosnia and Herzegovina', countryName: 'Bosnia and Herzegovina' },
{ countryCode: 'Botswana', countryName: 'Botswana' },
{ countryCode: 'Brazil', countryName: 'Brazil' },
{ countryCode: 'Brunei', countryName: 'Brunei' },
{ countryCode: 'Bulgaria', countryName: 'Bulgaria' },
{ countryCode: 'Burkina Faso', countryName: 'Burkina Faso' },
{ countryCode: 'Burundi', countryName: 'Burundi' },
{ countryCode: 'Cabo Verde', countryName: 'Cabo Verde' },
{ countryCode: 'Cambodia', countryName: 'Cambodia' },
{ countryCode: 'Cameroon', countryName: 'Cameroon' },
{ countryCode: 'Canada', countryName: 'Canada' },
{ countryCode: 'Central African Republic', countryName: 'Central African Republic' },
{ countryCode: 'Chad', countryName: 'Chad' },
{ countryCode: 'Chile', countryName: 'Chile' },
{ countryCode: 'China', countryName: 'China' },
{ countryCode: 'Colombia', countryName: 'Colombia' },
{ countryCode: 'Comoros', countryName: 'Comoros' },
{ countryCode: 'Congo (Congo-Brazzaville)', countryName: 'Congo (Congo-Brazzaville)' },
{ countryCode: 'Costa Rica', countryName: 'Costa Rica' },
{ countryCode: 'Côte dIvoire,', countryName: 'Côte dIvoire,' },
{ countryCode: 'Croatia', countryName: 'Croatia' },
{ countryCode: 'Cuba', countryName: 'Cuba' },
{ countryCode: 'Cyprus', countryName: 'Cyprus' },
{ countryCode: 'Czechia (Czech Republic)', countryName: 'Czechia (Czech Republic)' },
{ countryCode: 'Democratic Republic of the Congo', countryName: 'Democratic Republic of the Congo' },
{ countryCode: 'Denmark', countryName: 'Denmark' },
{ countryCode: 'Djibouti', countryName: 'Djibouti' },
{ countryCode: 'Dominica', countryName: 'Dominica' },
{ countryCode: 'Dominican Republic', countryName: 'Dominican Republic' },
{ countryCode: 'Ecuador', countryName: 'Ecuador' },
{ countryCode: 'Egypt', countryName: 'Egypt' },
{ countryCode: 'El Salvador', countryName: 'El Salvador' },
{ countryCode: 'Equatorial Guinea', countryName: 'Equatorial Guinea' },
{ countryCode: 'Eritrea', countryName: 'Eritrea' },
{ countryCode: 'Estonia', countryName: 'Estonia' },
{ countryCode: 'Eswatini (fmr. ""Swaziland"")', countryName: 'Eswatini (fmr. ""Swaziland"")' },
{ countryCode: 'Ethiopia', countryName: 'Ethiopia' },
{ countryCode: 'Fiji', countryName: 'Fiji' },
{ countryCode: 'Finland', countryName: 'Finland' },
{ countryCode: 'France', countryName: 'France' },
{ countryCode: 'Gabon', countryName: 'Gabon' },
{ countryCode: 'Gambia', countryName: 'Gambia' },
{ countryCode: 'Georgia', countryName: 'Georgia' },
{ countryCode: 'Germany', countryName: 'Germany' },
{ countryCode: 'Ghana', countryName: 'Ghana' },
{ countryCode: 'Greece', countryName: 'Greece' },
{ countryCode: 'Grenada', countryName: 'Grenada' },
{ countryCode: 'Guatemala', countryName: 'Guatemala' },
{ countryCode: 'Guinea', countryName: 'Guinea' },
{ countryCode: 'Guinea-Bissau', countryName: 'Guinea-Bissau' },
{ countryCode: 'Guyana', countryName: 'Guyana' },
{ countryCode: 'Haiti', countryName: 'Haiti' },
{ countryCode: 'Holy See', countryName: 'Holy See' },
{ countryCode: 'Honduras', countryName: 'Honduras' },
{ countryCode: 'Hungary', countryName: 'Hungary' },
{ countryCode: 'Iceland', countryName: 'Iceland' },
{ countryCode: 'India', countryName: 'India' },
{ countryCode: 'Indonesia', countryName: 'Indonesia' },
{ countryCode: 'Iran', countryName: 'Iran' },
{ countryCode: 'Iraq', countryName: 'Iraq' },
{ countryCode: 'Ireland', countryName: 'Ireland' },
{ countryCode: 'Israel', countryName: 'Israel' },
{ countryCode: 'Italy', countryName: 'Italy' },
{ countryCode: 'Jamaica', countryName: 'Jamaica' },
{ countryCode: 'Japan', countryName: 'Japan' },
{ countryCode: 'Jordan', countryName: 'Jordan' },
{ countryCode: 'Kazakhstan', countryName: 'Kazakhstan' },
{ countryCode: 'Kenya', countryName: 'Kenya' },
{ countryCode: 'Kiribati', countryName: 'Kiribati' },
{ countryCode: 'Kuwait', countryName: 'Kuwait' },
{ countryCode: 'Kyrgyzstan', countryName: 'Kyrgyzstan' },
{ countryCode: 'Laos', countryName: 'Laos' },
{ countryCode: 'Latvia', countryName: 'Latvia' },
{ countryCode: 'Lebanon', countryName: 'Lebanon' },
{ countryCode: 'Lesotho', countryName: 'Lesotho' },
{ countryCode: 'Liberia', countryName: 'Liberia' },
{ countryCode: 'Libya', countryName: 'Libya' },
{ countryCode: 'Liechtenstein', countryName: 'Liechtenstein' },
{ countryCode: 'Lithuania', countryName: 'Lithuania' },
{ countryCode: 'Luxembourg', countryName: 'Luxembourg' },
{ countryCode: 'Madagascar', countryName: 'Madagascar' },
{ countryCode: 'Malawi', countryName: 'Malawi' },
{ countryCode: 'Malaysia', countryName: 'Malaysia' },
{ countryCode: 'Maldives', countryName: 'Maldives' },
{ countryCode: 'Mali', countryName: 'Mali' },
{ countryCode: 'Malta', countryName: 'Malta' },
{ countryCode: 'Marshall Islands', countryName: 'Marshall Islands' },
{ countryCode: 'Mauritania', countryName: 'Mauritania' },
{ countryCode: 'Mauritius', countryName: 'Mauritius' },
{ countryCode: 'México', countryName: 'México' },
{ countryCode: 'Micronesia', countryName: 'Micronesia' },
{ countryCode: 'Moldova', countryName: 'Moldova' },
{ countryCode: 'Monaco', countryName: 'Monaco' },
{ countryCode: 'Mongolia', countryName: 'Mongolia' },
{ countryCode: 'Montenegro', countryName: 'Montenegro' },
{ countryCode: 'Morocco', countryName: 'Morocco' },
{ countryCode: 'Mozambique', countryName: 'Mozambique' },
{ countryCode: 'Myanmar (formerly Burma)', countryName: 'Myanmar (formerly Burma)' },
{ countryCode: 'Namibia', countryName: 'Namibia' },
{ countryCode: 'Nauru', countryName: 'Nauru' },
{ countryCode: 'Nepal', countryName: 'Nepal' },
{ countryCode: 'Netherlands', countryName: 'Netherlands' },
{ countryCode: 'New Zealand', countryName: 'New Zealand' },
{ countryCode: 'Nicaragua', countryName: 'Nicaragua' },
{ countryCode: 'Niger', countryName: 'Niger' },
{ countryCode: 'Nigeria', countryName: 'Nigeria' },
{ countryCode: 'North Korea', countryName: 'North Korea' },
{ countryCode: 'North Macedonia', countryName: 'North Macedonia' },
{ countryCode: 'Norway', countryName: 'Norway' },
{ countryCode: 'Oman', countryName: 'Oman' },
{ countryCode: 'Pakistan', countryName: 'Pakistan' },
{ countryCode: 'Palau', countryName: 'Palau' },
{ countryCode: 'Palestine State', countryName: 'Palestine State' },
{ countryCode: 'Panama', countryName: 'Panama' },
{ countryCode: 'Papua New Guinea', countryName: 'Papua New Guinea' },
{ countryCode: 'Paraguay', countryName: 'Paraguay' },
{ countryCode: 'Peru', countryName: 'Peru' },
{ countryCode: 'Philippines', countryName: 'Philippines' },
{ countryCode: 'Poland', countryName: 'Poland' },
{ countryCode: 'Portugal', countryName: 'Portugal' },
{ countryCode: 'Qatar', countryName: 'Qatar' },
{ countryCode: 'Romania', countryName: 'Romania' },
{ countryCode: 'Russia', countryName: 'Russia' },
{ countryCode: 'Rwanda', countryName: 'Rwanda' },
{ countryCode: 'Saint Kitts and Nevis', countryName: 'Saint Kitts and Nevis' },
{ countryCode: 'Saint Lucia', countryName: 'Saint Lucia' },
{ countryCode: 'Saint Vincent and the Grenadines', countryName: 'Saint Vincent and the Grenadines' },
{ countryCode: 'Samoa', countryName: 'Samoa' },
{ countryCode: 'San Marino', countryName: 'San Marino' },
{ countryCode: 'Sao Tome and Principe', countryName: 'Sao Tome and Principe' },
{ countryCode: 'Saudi Arabia', countryName: 'Saudi Arabia' },
{ countryCode: 'Senegal', countryName: 'Senegal' },
{ countryCode: 'Serbia', countryName: 'Serbia' },
{ countryCode: 'Seychelles', countryName: 'Seychelles' },
{ countryCode: 'Sierra Leone', countryName: 'Sierra Leone' },
{ countryCode: 'Singapore', countryName: 'Singapore' },
{ countryCode: 'Slovakia', countryName: 'Slovakia' },
{ countryCode: 'Slovenia', countryName: 'Slovenia' },
{ countryCode: 'Solomon Islands', countryName: 'Solomon Islands' },
{ countryCode: 'Somalia', countryName: 'Somalia' },
{ countryCode: 'South Africa', countryName: 'South Africa' },
{ countryCode: 'South Korea', countryName: 'South Korea' },
{ countryCode: 'South Sudan', countryName: 'South Sudan' },
{ countryCode: 'Spain', countryName: 'Spain' },
{ countryCode: 'Sri Lanka', countryName: 'Sri Lanka' },
{ countryCode: 'Sudan', countryName: 'Sudan' },
{ countryCode: 'Suriname', countryName: 'Suriname' },
{ countryCode: 'Sweden', countryName: 'Sweden' },
{ countryCode: 'Switzerland', countryName: 'Switzerland' },
{ countryCode: 'Syria', countryName: 'Syria' },
{ countryCode: 'Tajikistan', countryName: 'Tajikistan' },
{ countryCode: 'Tanzania', countryName: 'Tanzania' },
{ countryCode: 'Thailand', countryName: 'Thailand' },
{ countryCode: 'Timor-Leste', countryName: 'Timor-Leste' },
{ countryCode: 'Togo', countryName: 'Togo' },
{ countryCode: 'Tonga', countryName: 'Tonga' },
{ countryCode: 'Trinidad and Tobago', countryName: 'Trinidad and Tobago' },
{ countryCode: 'Tunisia', countryName: 'Tunisia' },
{ countryCode: 'Turkey', countryName: 'Turkey' },
{ countryCode: 'Turkmenistan', countryName: 'Turkmenistan' },
{ countryCode: 'Tuvalu', countryName: 'Tuvalu' },
{ countryCode: 'Uganda', countryName: 'Uganda' },
{ countryCode: 'Ukraine', countryName: 'Ukraine' },
{ countryCode: 'United Arab Emirates', countryName: 'United Arab Emirates' },
{ countryCode: 'United Kingdom', countryName: 'United Kingdom' },
{ countryCode: 'United States of America', countryName: 'United States of America' },
{ countryCode: 'Uruguay', countryName: 'Uruguay' },
{ countryCode: 'Uzbekistan', countryName: 'Uzbekistan' },
{ countryCode: 'Vanuatu', countryName: 'Vanuatu' },
{ countryCode: 'Venezuela', countryName: 'Venezuela' },
{ countryCode: 'Vietnam', countryName: 'Vietnam' },
{ countryCode: 'Yemen', countryName: 'Yemen' },
{ countryCode: 'Zambia', countryName: 'Zambia' },
{ countryCode: 'Zimbabwe', countryName: 'Zimbabwe' }
];

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');    
    const conceptTxt = JSON.parse(localStorage.getItem('conceptTxtMain') || '{}');    
    this.loggedUser = user;   
    this.conceptTxtMain = conceptTxt;
    this.conceptTxtIDMain = JSON.parse(localStorage.getItem('conceptTxtIDMain') || '{}');     
    this.getIniClientList(1,1,0,1);

  }

  getIniClientList(pIdApplication: number,
                   pIdCompany: number,
                   pIdClient: number,
                   pTypeOperation: number
                  ){
    this.clientDetListReq.idApplication = pIdApplication;
    this.clientDetListReq.idCompany = pIdCompany;
    this.clientDetListReq.idClient = pIdClient;
    this.clientDetListReq.operationType = pTypeOperation;
    
    this.clientService.getListClientDet(this.clientDetListReq).subscribe({
    next: (response) => {
      this.listClients = response;
      this.listClientsOrg = response;
      console.log("Lista concept relacionables: ", this.listClients);    
    },
      error: () => {
        this.error = true;
      }
    });	  
  }
  
  onLogout() {
    this.router.navigate(['/login']);
  }
  
  goQualify() {    
    this.router.navigate(['/qualify']);
  }
  
  goClients() {    
    this.router.navigate(['/clients']);
  }

  goConcepts(){
    this.router.navigate(['/concepts']);
  }

  sortData(sort: Sort) {

  }

  onOpenSaveClient(){
    const modal = document.getElementById('modalSaveClient');    
    if(modal != null){
      modal.style.display = 'block';              
    }

    const miFecha = new Date();
    const fechaFormateada = formatDate(miFecha, 'yyyy-MM-dd', 'en-US');

    this.todayDate = fechaFormateada;

  }
  
  onCloseSaveClient(){
    const modal = document.getElementById('modalSaveClient');    
    if(modal != null){
      modal.style.display = 'none';              
    }

  }

  onSearchTable(event: Event, typeCol: number){

  }

  onOpenUpdateClient(item: any) {

    console.log('ID: ',item.idClientDet);

    const modal = document.getElementById('modalUpdate');    
    if(modal != null){
      modal.style.display = 'block';              
    }
    
    this.clientFormUpd.value.htmlRfcUpd = item.indRfc;    
    

    const htmlRfcUpd = document.getElementById('htmlRfcUpd') as HTMLInputElement | null;
    if (htmlRfcUpd !== null) {
      htmlRfcUpd.value = item.indRfc;
    }

  }

  onOpenDeleteClient(item: any) {

  }

  onOpenClientPopup(item: any){

  }  

  onSaveClientAction(){
    this.clientDetCrudReq.idClient = 0;
    this.clientDetCrudReq.idApplication = 1;
    this.clientDetCrudReq.idCompany = 1;
    console.log('this.clientForm.value.htmlDocDate',this.clientForm.value.htmlDocDate)
    this.clientDetCrudReq.fecDocumentDate = this.clientForm.value.htmlDocDate;
    this.clientDetCrudReq.indFirstName = this.clientForm.value.htmlFirName;
    this.clientDetCrudReq.indSecondName = this.clientForm.value.htmlSecName;
    this.clientDetCrudReq.indNames = this.clientForm.value.htmlNames;
    this.clientDetCrudReq.indNationality = this.clientForm.value.htmlNatty;
    this.clientDetCrudReq.indCountryBirth = this.clientForm.value.htmlCouBir;
    console.log('this.clientForm.value.htmlBirDate',this.clientForm.value.htmlBirDate)
    this.clientDetCrudReq.fecBirthDate = this.clientForm.value.htmlBirDate;
    this.clientDetCrudReq.indEconomicAct = this.clientForm.value.htmlEcoAct;
    this.clientDetCrudReq.indRfc = this.clientForm.value.htmlRfc;
    this.clientDetCrudReq.indAddressStreet = this.clientForm.value.htmlAddStrt;
    this.clientDetCrudReq.indAddressNum = this.clientForm.value.htmlAddNum;
    this.clientDetCrudReq.indAddressSuburb = this.clientForm.value.htmlAddSubb;
    this.clientDetCrudReq.indAddressCp = this.clientForm.value.htmlAddCp;
    this.clientDetCrudReq.indAddressCity = this.clientForm.value.htmlAddCity;
    this.clientDetCrudReq.indAddressTown = this.clientForm.value.htmlAddTown;
    this.clientDetCrudReq.indAddressState = this.clientForm.value.htmlAddState;
    this.clientDetCrudReq.indPhoneNumber = this.clientForm.value.htmlPhoneNum;
    this.clientDetCrudReq.indPhoneExt = this.clientForm.value.htmlPhoneExt;
    this.clientDetCrudReq.indPhoneSmart = this.clientForm.value.htmlPhoneSmt;
    this.clientDetCrudReq.indCountry = this.clientForm.value.htmlCountry;
    this.clientDetCrudReq.indCurp = this.clientForm.value.htmlCurp;
    this.clientDetCrudReq.indEmail = this.clientForm.value.htmlEmail;
    this.clientDetCrudReq.indIdOficial = this.clientForm.value.htmlIdOf;
    this.clientDetCrudReq.indIdName = this.clientForm.value.htmlIdName;
    this.clientDetCrudReq.indIdAuthority = this.clientForm.value.htmlIdAut;
    this.clientDetCrudReq.indForeign = this.clientForm.value.htmlForeign;
    this.clientDetCrudReq.indFstreet = this.clientForm.value.htmlFstreet;
    this.clientDetCrudReq.indFnumber = this.clientForm.value.htmlFnumber;
    this.clientDetCrudReq.indFsuburb = this.clientForm.value.htmlFsuburb;
    this.clientDetCrudReq.indFcity = this.clientForm.value.htmlFcity;
    this.clientDetCrudReq.indFstate = this.clientForm.value.htmlFstate;
    this.clientDetCrudReq.indFcp = this.clientForm.value.htmlFcp;
    this.clientDetCrudReq.indFcountry = this.clientForm.value.htmlFcoun;
    this.clientDetCrudReq.indBcontroller = this.clientForm.value.htmlBcont;
    this.clientDetCrudReq.indBcDoc = this.clientForm.value.htmlBcDoc;
    this.clientDetCrudReq.operationType = 1;
    this.clientDetCrudReq.createdBy = 'jlbautistas';
    this.clientDetCrudReq.indEstatus = 'A';
    this.clientDetCrudReq.username = 'jlbautistas';

    this.clientService.crudClientDet(this.clientDetCrudReq).subscribe({
      next: (responseSave) => {     
        //console.log('(Main) Respuesta SAVE: ',responseSave);         
        this.clientDetCrudRes = responseSave;
        if (this.clientDetCrudRes.codeStatus == 'SUCCESS') {
          Swal.fire({
              icon: "success",
              title: "Conceptos",
              text: "El Concepto fue almacenado satisfactoriamente",
              footer: '<p>Concepto <strong>'+this.clientForm.value.htmlRfc+'</strong> guardado con éxito</p>'
            });
            //this.refreshApiTable();
            this.onCloseSaveClient();
            this.getIniClientList(1, 1, 0, 1);
        } else {
          Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: 'Texto: '+this.clientDetCrudRes.codeDescription,
              footer: '<p>Favor de validar con el Administrador</p>'
            });
        }
      },
      error: () => {
            Swal.fire({
              icon: "error",
              title: "No Satisfactorio",
              text: this.clientDetCrudRes.codeDescription,
              footer: '<p>'+this.error+'</p>'
            });
        console.error('(Main) exception: ', this.error);
      }
    });	

  }

  onUpdateAction(){
    console.log('this.clientFormUpd.value.htmlRfcUpd: ',this.clientFormUpd.value.htmlRfcUpd)

  }

  onCloseUpdate(){
    const modal = document.getElementById('modalUpdate');    
    if(modal != null){
      modal.style.display = 'none';
    }
  }

}
