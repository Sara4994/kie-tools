import React, { useState } from "react";
import CatalogTable from "./CatalogTable";
import CatalogForm from "./CatalogForm";

const Catalogs = () => {
  const [isCatalogForm, setIsCatalogForm] = useState(false);
  const handleFormModalToggle = (): void => {
    setIsCatalogForm(!isCatalogForm);
  };
  return (
    <React.Fragment>
      <CatalogTable handleFormModalToggle={handleFormModalToggle} />
      <CatalogForm isCatalogForm={isCatalogForm} handleFormModalToggle={handleFormModalToggle} />
    </React.Fragment>
  );
};

export default Catalogs;
