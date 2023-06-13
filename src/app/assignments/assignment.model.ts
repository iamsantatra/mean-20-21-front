import { Matiere } from "../models/matiere.model";
import { Utilisateur } from "../models/user.model";

export class Assignment {
    _id!: string;
    idAssignment?: number;
    nom!: string;
    dateDeRendu!: Date;
    rendu!: boolean;
    note?: number;
    idMatiere!: number;
    idEleve!: number;
    remarques?: string;
    matiere?: Matiere;
    eleve?: Utilisateur;
    prof?: Utilisateur;
}

