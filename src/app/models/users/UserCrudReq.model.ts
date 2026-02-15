export interface UserCrudReq{
    idUser: number;
    idApplication: number;
    idCompany: number;    
    indRfc: string;
    indFirstName: string;
    indSecondName: string;
    indName: string;
    indUsername: string;
    indDescription: string;
    indEmail: string;
    indRol: string;
    indEstatus: string;
    username: string;
    operationType: number;
}