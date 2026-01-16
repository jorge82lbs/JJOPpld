export interface RelationSelectRes{
    id: number; 
    idRelation: number; 
    idApplication: number; 
    idCompany: number; 
    idConceptRel: number; 
    nomConceptRel: string; 
    idConcept: number; 
    nomConcept: string; 
    indEstatus: string; 
    fecCreationDate: Date; 
    fecLastUpdateDate: Date; 
    createdBy: string; 
    lastUpdatedBy: string; 
}