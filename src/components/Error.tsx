import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface Props {
    error: any;
}

export function Error({ error }: Props) {
    return <div><ExclamationCircleOutlined/> {error}</div>
}