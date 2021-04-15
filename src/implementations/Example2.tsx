import React from 'react';

import { Patient } from 'src/types';
import { pause } from 'src/utils';
import { PatientList } from 'src/components/PatientList';
import { Preloader } from 'src/components/Preloader';
import { Error } from 'src/components/Error';
import {
    failure,
    isFailure, isLoading,
    isSuccess,
    loading,
    notAsked,
    RemoteData,
    success,
} from 'src/react-remote-data/types';

export function Example2() {
    const [remoteData, setRemoteData] = React.useState<RemoteData<Array<Patient>>>(notAsked);

    React.useEffect(() => {
        const load = async () => {
            setRemoteData(loading);
            await pause(2000);

            try {
                const response = await fetch('http://localhost:3000/api/patients.json');
                const json = await response.json();

                setRemoteData(success(json));
            } catch (err) {
                setRemoteData(failure(err.response ? err.response.data : err.message));
            }
        };

        load();
        // Empty deps - only on first render
    }, []);

    if (isLoading(remoteData)) {
        return <Preloader />
    }

    if (isSuccess(remoteData)) {
        if (!remoteData.data.length) {
            return <div>You have no patients in the database</div>;
        }

        return <PatientList patients={remoteData.data} />;
    }

    if (isFailure(remoteData)) {
        return <Error error={remoteData.error} />;
    }

    return null;
}
