'use client';

import { Alert } from '../utils/Alert.util';
import { useAlert } from '../../scripts/Alert.context';

export const AlertContainer = () => {
    const { alerts, removeAlert } = useAlert();

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    alertId={alert.id}
                    type={alert.type}
                    message={alert.message}
                    onClose={removeAlert}
                />
            ))}
        </div>
    );
};