import { useState, useEffect } from "react";
import DigitalCatalogueFolders from "../components/digital-catalogue/DigitalCatalogueFolders";
import FolderSelectButton from "../components/digital-catalogue/FolderSelectButton";

const DigitalCatalogue = () => {
    
    const [basePath, setBasePath] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const bp = await window.api.filesystem.getBasePath();
        if (!bp) return;
    
        setBasePath(bp);
      };
    
      fetchData();
    }, [basePath]);
    

    return (
        <div className="digital-catalogue">
          <h1>Digital Catalogue</h1>
          {basePath ? (
          <DigitalCatalogueFolders folderPath={basePath} />
          ) : (
            <div className="mt-4">
              <p>No folder path set. Please choose a folder to view digital holdings.</p>
              <FolderSelectButton />
            </div>
          )}
        </div>
    )
}

export default DigitalCatalogue;