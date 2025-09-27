import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const useFolderCheck = () => {
  const [exists, setExists] = useState(null);
  const [cataloguePath, setCataloguePath] = useState("");
  const location = useLocation();

  const checkFolder = useCallback(async () => {
    const { exists, basePath } = await window.api.filesystem.getBasePath();
    setExists(exists);
    setCataloguePath(basePath);
  }, []);

  useEffect(() => {
    checkFolder();
  }, [checkFolder, location.pathname]);

  return { exists, cataloguePath, refresh: checkFolder };
};

export default useFolderCheck;
