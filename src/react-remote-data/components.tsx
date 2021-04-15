import React from 'react';

import { isFailure, isLoading, isNotAsked, isSuccess, RemoteData } from './types';

interface RenderConfig<E = any> {
    renderFailure?: (error: E) => React.ReactElement;
    renderLoading?: () => React.ReactElement;
    renderNotAsked?: () => React.ReactElement;
}

interface RemoteDataRendererBasicProps<S, E = any> {
    remoteData: RemoteData<S, E>;
    children: (data: S) => React.ReactElement;
}

function renderFailureDefault<E>(error: E) {
    return <>{JSON.stringify(error)}</>;
}

function renderLoadingDefault() {
    return <>Loading...</>;
}

type RemoteDataRendererProps<S, E = any> = RemoteDataRendererBasicProps<S> & RenderConfig<E>;

export function RemoteDataRenderer<S, E = any>(props: RemoteDataRendererProps<S, E>) {
    const { remoteData, children, renderFailure, renderLoading, renderNotAsked } = props;
    if (isNotAsked(remoteData)) {
        return renderNotAsked ? renderNotAsked() : null;
    } else if (isLoading(remoteData)) {
        return (renderLoading ?? renderLoadingDefault)();
    } else if (isFailure(remoteData)) {
        return (renderFailure ?? renderFailureDefault)(remoteData.error);
    } else if (isSuccess(remoteData)) {
        return children(remoteData.data);
    }

    return null;
}

