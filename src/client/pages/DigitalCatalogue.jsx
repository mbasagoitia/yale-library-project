import { useState, useEffect } from "react";
import DigitalCatalogueFolders from "../components/digital-catalogue/DigitalCatalogueFolders";

const DigitalCatalogue = () => {
    
    const [basePath, setBasePath] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const bp = await window.electronAPI.getBasePath();
        if (!bp) return;
    
        setBasePath(bp);
      };
    
      fetchData();
    }, [basePath]);
    

    return (
        <div className="digital-catalogue">
            <DigitalCatalogueFolders folderPath={basePath} />
        </div>
    )
}

export default DigitalCatalogue;