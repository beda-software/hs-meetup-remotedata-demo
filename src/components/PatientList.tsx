import React from 'react';
import { List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { ExtendedPatient } from '../types';

interface Props {
    patients: Array<ExtendedPatient>;
}

export function PatientList({ patients }: Props) {
    return (
        <List<ExtendedPatient>
            itemLayout="horizontal"
            dataSource={patients}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.name}
                        description={<PatientDescription item={item} />}
                    />
                </List.Item>
            )}
        />
    );
}

function PatientDescription({ item }: { item: ExtendedPatient }) {
    if (item.practitionerName) {
        return (
            <>
                <b>ID:</b> {item.id}
                <br />
                <b>Practitioner:</b> {item.practitionerName}
            </>
        );
    }

    return (
        <>
            <b>ID:</b> {item.id}
        </>
    );
}
