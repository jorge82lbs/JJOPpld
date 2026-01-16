export interface UmDetSelectRes{
    id: number; 
    idUmbralDet: number;
    idApplication: number;
    idCompany: number;
    idConceptRel: number;
    idConcept: number;
    nomConceptRel: string;
    nomConcept: string;
    idRelation: number;
    typeRule: string;
    initialRange: number;
    finalRange: number;
    groupRange: string;
    numAmount: number;
    determinant: number;
    nomRule: string;
    indEstatus: string; 
    fecCreationDate: Date; 
    fecLastUpdateDate: Date; 
    createdBy: string; 
    lastUpdatedBy: string;
}