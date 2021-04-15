import React from 'react';

import { Patient, Practitioner } from './types';
import { pause, preparePatientsData } from './utils';
import { PatientList } from './components/PatientList';
import { Preloader } from './components/Preloader';
import { Error } from './components/Error';

export function SecondPart() {
    const [patientData,setPatientsData] = React.useState<Array<Patient> | null>(null);
    const [patientsError, setPatientsError] = React.useState<any>(null);
    const [isPatientsLoading, setIsPatientsLoading] = React.useState<boolean>(false);

        const [practitionersData,setPractitionersData] = React.useState<Array<Practitioner> | null>(null);
    const [practitionersError, setPractitionersError] = React.useState<any>(null);
    const [isPractitionersLoading, setIsPractitionersLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const load = async () => {
            setIsPatientsLoading(true);
            await pause(2000);

            try {
                const response = await fetch('http://localhost:3000/api/patients.json');
                const json = await response.json();

                setPatientsData(json);
            } catch (err) {
                setPatientsError(err.response ? err.response.data : err.message);
            }
            setIsPatientsLoading(false);
        };

        load();
        // Empty deps - only on first render
    }, []);


    React.useEffect(() => {
        const load = async () => {
            setIsPractitionersLoading(true);
            await pause(2000);

            try {
                const response = await fetch('http://localhost:3000/api/practitioners.json');
                const json = await response.json();

                setPractitionersData(json);
            } catch (err) {
                setPractitionersError(err.response ? err.response.data : err.message);
            }
            setIsPractitionersLoading(false);
        };

        load();
        // Empty deps - only on first render
    }, []);

    if (isPatientsLoading || isPractitionersLoading) {
        return <Preloader />;
    }

    if (patientsError) {
        return <Error error={patientsError} />;
    }

    if (practitionersError) {
        return <Error error={practitionersError} />;
    }

    if (patientData && practitionersData) {
        if (!patientData.length) {
            return <div>You have no patients in the database</div>;
        }

        return <PatientList patients={preparePatientsData(patientData, practitionersData)} />;
    }

    return null;
}

