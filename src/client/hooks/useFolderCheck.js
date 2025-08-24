import { useState, useEffect } from "react";

const useFolderCheck = () => {
  const [exists, setExists] = useState(null);
  const [cataloguePath, setCataloguePath] = useState("");

  useEffect(() => {
    const checkFolder = async () => {
      // Does the folder still exist where we expect it (does it match what is stored in Electron store)?
      const { exists, basePath } = await window.api.filesystem.getBasePath();
      setExists(exists);
      setCataloguePath(basePath);
    };

    checkFolder();
  }, []);

  return { exists, cataloguePath };
};

export default useFolderCheck;
