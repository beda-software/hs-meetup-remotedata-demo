import React from 'react';

import { Patient } from 'src/types';
import { pause } from 'src/utils';
import { PatientList } from 'src/components/PatientList';
import { Preloader } from 'src/components/Preloader';
import { Error } from 'src/components/Error';

export function Example1() {
    const [data, setData] = React.useState<Array<Patient> | null>(null);
    const [error, setError] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            await pause(2000);

            try {
                const response = await fetch('http://localhost:3000/api/patients.json');
                const json = await response.json();

                setData(json);
            } catch (err) {
                setError(err.response ? err.response.data : err.message);
            }
            setIsLoading(false);
        };

        load();
        // Empty deps - only on first render
    }, []);

    if (isLoading) {
        return <Preloader />;
    }

    if (error) {
        return <Error error={error} />;
    }

    if (data) {
        if (!data.length) {
            return <div>You have no patients in the database</div>;
        }

        return <PatientList patients={data} />;
    }

    return null;
}
