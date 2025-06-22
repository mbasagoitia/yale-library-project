import { useState, useEffect } from "react";
import DigitalCatalogueFolders from "../components/digital-catalogue/DigitalCatalogueFolders";

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
          <DigitalCatalogueFolders folderPath={basePath} />
        </div>
    )
}

export default DigitalCatalogue;