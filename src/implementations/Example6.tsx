import React from 'react';

import { pause, preparePatientsData } from 'src/utils';
import { PatientList } from 'src/components/PatientList';
import { Preloader } from 'src/components/Preloader';
import { Error } from 'src/components/Error';
import {
    failure,
    isFailure,
    isSuccess,
    RemoteDataResult,
    success,
} from 'src/react-remote-data/types';
import { useService } from 'src/react-remote-data/hooks';
import { mapSuccess, sequenceArray } from 'src/react-remote-data/utils';

async function service<S = any, E = any>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<RemoteDataResult<S, E>> {
    try {
        const response = await fetch(input, init);
        const json = await response.json();

        return success(json);
    } catch (err) {
        return failure(err.response ? err.response.data : err.message);
    }
}

export function Example6() {
    const [patientsRemoteData] = useService(() => service('http://localhost:3000/api/patients.json'));
    const [practitionersRemoteData] = useService(() =>
        service('http://localhost:3000/api/practitioners.json'),
    );

    const remoteData = React.useMemo(
        () =>
            mapSuccess(
                sequenceArray([patientsRemoteData, practitionersRemoteData]),
                ([patients, practitioners]) => preparePatientsData(patients, practitioners)
            ),
        [patientsRemoteData, practitionersRemoteData],
    );


    if (isSuccess(remoteData)) {
        const preparedPatients = remoteData.data;
        if (!preparedPatients.length) {
            return <div>You have no patients in the database</div>;
        }

        return <PatientList patients={preparedPatients} />;
    }

    if (isFailure(remoteData)) {
        return <Error error={remoteData.error} />;
    }

    return <Preloader />;
}
