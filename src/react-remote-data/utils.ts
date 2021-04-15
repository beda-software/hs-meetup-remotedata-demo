import { AxiosRequestConfig } from 'axios';

import {
    failure,
    isFailure,
    isSuccess,
    isSuccessAll,
    RemoteDataResult,
    success,
    RemoteData,
    isFailureAny,
    isLoadingAny,
    loading,
    notAsked,
} from './types';


export function mapSuccess<S = any, F = any, R = any>(
    remoteData: RemoteDataResult<S, F>,
    transformer: (data: S) => R
): RemoteDataResult<R, F>;
export function mapSuccess<S = any, F = any, R = any>(
    remoteData: RemoteData<S, F>,
    transformer: (data: S) => R
): RemoteData<R, F>;
export function mapSuccess<S = any, F = any, R = any>(
    remoteData: RemoteData<S, F>,
    transformer: (data: S) => R
): RemoteData<R, F> {
    if (isSuccess(remoteData)) {
        return success(transformer(remoteData.data));
    }

    return remoteData;
}

export function mapFailure<S = any, F = any, R = any>(
    remoteData: RemoteDataResult<S, F>,
    transformer: (error: F) => R
): RemoteDataResult<S, R>;
export function mapFailure<S = any, F = any, R = any>(
    remoteData: RemoteData<S, F>,
    transformer: (error: F) => R
): RemoteData<S, R>;
export function mapFailure<S = any, F = any, R = any>(
    remoteData: RemoteData<S, F>,
    transformer: (error: F) => R
): RemoteData<S, R> {
    if (isFailure(remoteData)) {
        return failure(transformer(remoteData.error));
    }

    return remoteData;
}

export type PromiseRemoteDataResultMap<T, F> = { [P in keyof T]: Promise<RemoteDataResult<T[P], F>> };
export type RemoteDataResultMap<T, F> = { [P in keyof T]: RemoteDataResult<T[P], F> };
export type PromiseRemoteDataMap<T, F> = { [P in keyof T]: Promise<RemoteData<T[P], F>> };
export type RemoteDataMap<T, F> = { [P in keyof T]: RemoteData<T[P], F> };

function createKeysMapTransformer<K = any>(keys: Array<K>) {
    return <S = any, R = any>(data: S): R =>
        keys.reduce((transformed, key, index) => {
            // @ts-ignore
            transformed[key] = data[index];
            return transformed;
        }, {} as any);
}

export function sequenceArray<T, F>(remoteDataArray: Array<RemoteDataResult<T, F>>): RemoteDataResult<T[], F[]>;
export function sequenceArray<T, F>(remoteDataArray: Array<RemoteData<T, F>>): RemoteData<T[], F[]>;
export function sequenceArray<T, F>(remoteDataArray: Array<RemoteData<T, F>>): RemoteData<T[], F[]> {
    if (isSuccessAll(remoteDataArray)) {
        return success(remoteDataArray.map((remoteDataResult) => remoteDataResult.data));
    }

    if (isFailureAny(remoteDataArray)) {
        return failure(
            remoteDataArray.reduce((accumulator, remoteDataResult: RemoteData<T, F>) => {
                if (isFailure(remoteDataResult)) {
                    accumulator.push(remoteDataResult.error);
                }
                return accumulator;
            }, [] as Array<F>)
        );
    }

    if (isLoadingAny(remoteDataArray)) {
        return loading;
    }

    return notAsked;
}

export function sequenceMap<I, F>(remoteDataMap: RemoteDataResultMap<I, F>): RemoteDataResult<I, F[]>;
export function sequenceMap<I, F>(remoteDataMap: RemoteDataMap<I, F>): RemoteData<I, F[]>;
export function sequenceMap<I, F>(remoteDataMap: RemoteDataMap<I, F>): RemoteData<I, F[]> {
    const keys = Object.keys(remoteDataMap);
    const remoteDataArray = Object.values(remoteDataMap) as Array<RemoteDataResult<any>>;

    return mapSuccess(sequenceArray(remoteDataArray), createKeysMapTransformer(keys));
}

