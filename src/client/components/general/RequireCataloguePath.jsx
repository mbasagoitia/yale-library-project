import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useFolderCheck from "../../hooks/useFolderCheck.js";
import MissingCatalogueNotice from "../general/MissingCatalogueNotice.jsx";

const RequireCataloguePath = ({ children }) => {
  const location = useLocation();
  const { exists: cataloguePathExists, refresh } = useFolderCheck();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
    if (cataloguePathExists !== null) {
      setChecked(true);
    }
  }, [cataloguePathExists, location.pathname]);

  // Skip catalogue check for /setup route because it isn't set yet
  if (location.pathname === "/setup") {
    return children;
  }

  if (!checked) return <div>Loading...</div>;

  if (!cataloguePathExists) {
    return (
      <MissingCatalogueNotice
        onPathSet={() => {
          refresh();
          setChecked(false);
        }}
      />
    );
  }

  return children;
};

export default RequireCataloguePath;
