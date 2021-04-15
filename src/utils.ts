import { ExtendedPatient, Patient, Practitioner } from './types';

export function pause(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function preparePatientsData(
    patients: Array<Patient>,
    practitioners: Array<Practitioner>,
): Array<ExtendedPatient> {
    return patients.map((patient) => {
        const assignedPractitioner = practitioners.find(
            (practitioner) => practitioner.id === patient.practitioner,
        );

        return { ...patient, practitionerName: assignedPractitioner?.name };
    });
}
