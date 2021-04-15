import { useCallback, useEffect, useState } from 'react';

import { loading, notAsked, RemoteData, RemoteDataResult, success, isSuccess } from './types';

export interface ServiceManager<S> {
    reload: () => void;
    set: (dataOrFn: S | ((data: S) => S)) => void;
}

export function useService<S = any, F = any>(
    asyncFunction: () => Promise<RemoteDataResult<S, F>>,
    deps: ReadonlyArray<any> = []
): [RemoteData<S, F>, ServiceManager<S>] {
    const [remoteData, setRemoteData] = useState<RemoteData<S, F>>(notAsked);

    const reload = useCallback(async() => {
        setRemoteData(loading);

        const response = await asyncFunction();

        setRemoteData(response);

        return response;
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        reload();
        // eslint-disable-next-line
    }, [reload, ...deps]);

    return [
        remoteData,
        {
            reload,
            set: (dataOrFn: S | ((data: S) => S)) => {
                if (typeof dataOrFn === 'function') {
                    setRemoteData((rd) => (isSuccess(rd) ? success((dataOrFn as (data: S) => S)(rd.data)) : rd));
                } else {
                    setRemoteData(success(dataOrFn));
                }
            },
        },
    ];
}
