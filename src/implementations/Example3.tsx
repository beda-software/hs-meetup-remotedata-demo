import React from 'react';

import { Patient } from 'src/types';
import { useService } from 'src/react-remote-data/hooks';
import {
    failure,
    isFailure,
    isSuccess,
    RemoteDataResult,
    success,
} from 'src/react-remote-data/types';
import { pause } from 'src/utils';
import { PatientList } from 'src/components/PatientList';
import { Preloader } from 'src/components/Preloader';
import { Error } from 'src/components/Error';

async function service<S = any, E = any>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<RemoteDataResult<S, E>> {
    try {
        await pause(2000);

        const response = await fetch(input, init);
        const json = await response.json();

        return success(json);
    } catch (err) {
        return failure(err.response ? err.response.data : err.message);
    }
}

export function Example3() {
    const [remoteData] = useService(() =>
        service<Array<Patient>>('http://localhost:3000/api/patients.json'),
    );

    if (isSuccess(remoteData)) {
        const patients = remoteData.data;

        if (!patients.length) {
            return <div>You have no patients in the database</div>;
        }

        return <PatientList patients={patients} />;
    }

    if (isFailure(remoteData)) {
        return <Error error={remoteData.error} />
    }

    return <Preloader />;
}
