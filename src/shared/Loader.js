import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const Loader = () => {
    return (
        <>
        <div className="p-d-flex d-flex-column">
            <Skeleton shape="circle" />
            <Skeleton className="p-mb-2" borderRadius="16px"></Skeleton>
        </div>
        </>
    );
};

export default Loader;