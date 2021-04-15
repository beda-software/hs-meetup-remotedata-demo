import React from 'react';

import { Patient } from './types';
import { pause } from './utils';
import { PatientList } from './components/PatientList';

export function FirstPart() {
    const [data, setData] = React.useState<Array<Patient>>([]);

    React.useEffect(() => {
        const load = async () => {
            await pause(2000);  // Emulate network lag

            const response = await fetch('http://localhost:3000/api/patients.json');
            const json = await response.json();
            setData(json);
        };

        load();
        // Empty deps - only on first render
    }, []);

    if (!data.length) {
        return <div>You have no patients in the database</div>;
    }

    return <PatientList patients={data} />;
}
