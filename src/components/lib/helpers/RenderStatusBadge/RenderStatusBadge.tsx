import React, { useState, useEffect } from 'react';
import Badge from '../../../ui/badge/Badge';

interface RenderStatusBadgeProps {
    status: string;
}

const RenderStatusBadge: React.FC<RenderStatusBadgeProps> = ({ status }) => {
    const [statusBadge, setStatusBadge] = useState<React.ReactNode>(null);

    useEffect(() => {
        const getStatusBadge = async () => {
            // Example of async logic, e.g., fetching data or performing async logic
            switch (status.toLowerCase()) {
                case "processing":
                    setStatusBadge(
                        <Badge variant="light" color="light">
                            {status}
                        </Badge>
                    );
                    break;
                case "In progress":
                    setStatusBadge(
                        <Badge variant="light" color="info">
                            {status}
                        </Badge>
                    );
                    break;
                case "completed":
                    setStatusBadge(
                        <Badge variant="light" color="success">
                            {status}
                        </Badge>
                    );
                    break;
                case "canceled":
                    setStatusBadge(
                        <Badge variant="light" color="error">
                            {status}
                        </Badge>
                    );
                    break;
                case "pending":
                    setStatusBadge(
                        <Badge variant="light" color="primary">
                            {status}
                        </Badge>
                    );
                    break;
                case "partial":
                    setStatusBadge(
                        <Badge variant="light" color="warning">
                            {status}
                        </Badge>
                    );
                    break;
                default:
                    setStatusBadge(
                        <Badge variant="light" color="dark">
                            {status}
                        </Badge>
                    );
                    break;
            }
        };

        getStatusBadge();
    }, [status]);

    return <>{statusBadge}</>;
};

export default RenderStatusBadge;