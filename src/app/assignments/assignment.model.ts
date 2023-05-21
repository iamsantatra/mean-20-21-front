export class Assignment {
    _id!: string;
    id?: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean;
    note?: number;
    idMatiere!: number;
    idEleve!: number;
    remarques?: string;
}

