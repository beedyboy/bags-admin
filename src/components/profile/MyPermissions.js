import React, { Fragment } from 'react';
import { Button } from 'primereact/button';
import { v4 as uuidv4 } from 'uuid';

const stretchAccess = (item) => {
  const result = [];
  for (const property in item) {
    result.push(
      <Button
        key={uuidv4()}
        type="button"
        label={item[property] ? `Can ${property}` : `Cannot ${property}`}
        icon={`pi ${item[property] ? "pi-check" : "pi-times"}`}
        className={`p-m-2 ${item[property] ? "p-button-success" : "p-button-danger"}`}
      />
    );
  }
  return <>{result}</>;
};

const renderRoles = (access) => {
  if (!access) return null;

  const keys = Object.keys(access);
  if (keys.length === 0) return null;

  return (
    <ul>
      {keys.map((key) => (
        <Fragment key={uuidv4()}>
          <li> {key.toUpperCase()} </li>
          {stretchAccess(access[key])}
        </Fragment>
      ))}
    </ul>
  );
};

const MyPermissions = ({ data }) => {
  return (
    <>
      {data.map((access, index) => (
        <div key={uuidv4()}>
          <h3>Role {index + 1}</h3>
          {renderRoles(access)}
        </div>
      ))}
    </>
  );
};

export default MyPermissions;
