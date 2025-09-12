import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DigitalCatalogueFolders from "../components/digital-catalogue/DigitalCatalogueFolders";
import "../../assets/styles/pages/DigitalCataloguePage.css";

const DigitalCatalogue = () => {

    const [basePath, setBasePath] = useState("");

    const location = useLocation();
    const initialPath = location.state?.initialPath;

    // Base path stored in Electron will be default folder
    useEffect(() => {
      const fetchBasePath = async () => {
        if (window.api?.filesystem?.getBasePath) {
          const { exists, basePath } = await window.api.filesystem.getBasePath();
          if (exists) {
            setBasePath(basePath);
          }
        }
      };
  
      fetchBasePath();
      
    }, []);

    // If the user has navigated here from a different page, set that as the basePath instead
    useEffect(() => {
      const getFullPath = async () => {
        if (initialPath) {
          if (window?.api?.filesystem?.getFullPath) {
            const fullPath = await window.api.filesystem.getFullPath(initialPath);
            setBasePath(fullPath);
          }
        }
      }
      getFullPath();

    }, [initialPath]);
    

    return (
        <div className="digital-catalogue">
          <h1>Digital Catalogue</h1>
          {basePath ? <DigitalCatalogueFolders folderPath={basePath} /> : null}
        </div>
    )
}

export default DigitalCatalogue;