import React from 'react';

const NoAccess = (props) => {
    const { page } = props;
    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card">
                    <h5>Access Denied!!!</h5>
                    <p> {`You do not have access to ${page} Page`}
</p>
                </div>
            </div>
        </div>
    );
}

export default NoAccess;