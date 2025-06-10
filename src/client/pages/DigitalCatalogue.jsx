import { useState, useEffect } from "react";
import DigitalCatalogueFolders from "../components/DigitalCatalogueFolders";

const DigitalCatalogue = () => {
    
    const [basePath, setBasePath] = useState(null);

    useEffect(() => {
        const fetchPath = async () => {
          const bp = await window.electronAPI.getBasePath();
          setBasePath(bp);
        };
    
        fetchPath();
      }, []);

    return (
        <div className="digital-catalogue">
            <DigitalCatalogueFolders folderPath={basePath} />
        </div>
    )
}

export default DigitalCatalogue;