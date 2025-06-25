import { useState, useEffect } from "react";
import DigitalCatalogueFolders from "../components/digital-catalogue/DigitalCatalogueFolders";
import FolderSelectButton from "../components/digital-catalogue/FolderSelectButton";
import { useSelector } from "react-redux";

const DigitalCatalogue = () => {
    
    const [basePath, setBasePath] = useState(null);
    const isAdmin = useSelector((state) => state.auth.isAdmin);

    useEffect(() => {
      const fetchBasePath = async () => {
        if (window.api?.filesystem.getBasePath) {
          const result = await window.api.filesystem.getBasePath();
          if (result) {
            setBasePath(result);
          }
        }
      };
  
      fetchBasePath();
      
  
      const handleBasePathUpdate = (event, newPath) => {
        setBasePath(newPath);
      };
      
  
      window.api?.events.on("base-path-updated", handleBasePathUpdate);
  
      return () => {
        window.api?.events.remove("base-path-updated", handleBasePathUpdate);
      };
  
    }, []);
    

    return (
        <div className="digital-catalogue">
          <h1>Digital Catalogue</h1>
          {basePath ? (
          <DigitalCatalogueFolders folderPath={basePath} />
          ) : (
            <div className="mt-4">
              <p>{`No folder path set. Please ${!isAdmin ? "login and" : ""} choose a folder to view digital holdings.`}</p>
              {isAdmin ? <FolderSelectButton /> : null}
            </div>
          )}
        </div>
    )
}

export default DigitalCatalogue;