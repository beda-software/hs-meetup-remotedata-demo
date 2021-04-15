export interface Patient {
    id: string;
    name: string;
    practitioner: string;
}

export interface ExtendedPatient extends Patient {
    practitionerName?: string;
}

export interface Practitioner {
    id: string;
    name: string;
}