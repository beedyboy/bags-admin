import React, { Fragment, useState, useEffect, useContext } from "react";
import { BrandList } from "../components/brand/BrandList";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { observer } from "mobx-react-lite";
import BrandStore from "../stores/BrandStore";
import BrandForm from "../components/brand/BrandForm";

const Brand = () => {
  const store = useContext(BrandStore);
  const {
    loading,
    getBrands,
    brands,
    error,
    checking,
    confirmName,
    saved,
    exist,
    action,
    message,
    removed,
    resetProperty,
    sending,
    createBrand,
    updateBrand,
  } = store;
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [rowData, setRowData] = useState();
  const toggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    getBrands();
  }, []);
  return (
    <Fragment>
      <div className="p-grid">
        <div className="p-col-12 p-md-12 p-lg-12">
          <Button label="Create New" onClick={toggle} />
        </div>
        <div className="p-col-12 p-md-12 p-lg-12">
          <BrandList
            data={brands}
            setMode={setMode}
            toggle={toggle}
            loading={loading}
            rowData={setRowData}
            removeData={removed}
          />
        </div>
      </div>
      <Dialog
        visible={open}
        onHide={toggle}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <BrandForm
          mode={mode}
          action={action}
          saved={saved}
          error={error}
          exist={exist}
          message={message}
          sending={sending}
          checking={checking}
          confirm={confirmName}
          handleClose={toggle}
          initial_data={rowData}
          reset={resetProperty}
          createBrand={createBrand}
          updateBrand={updateBrand}
        />
      </Dialog>
    </Fragment>
  );
};

export default observer(Brand);
