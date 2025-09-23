import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DigitalCatalogueFolders from "../components/digital-catalogue/DigitalCatalogueFolders";
import "../../assets/styles/pages/DigitalCataloguePage.css";
import { ArrowLeft } from "react-bootstrap-icons";

const DigitalCatalogue = () => {

    const [basePath, setBasePath] = useState("");

    const location = useLocation();
    const initialPath = location.state?.initialPath;

    const navigate = useNavigate();

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

    // If the user has navigated here from a different page (piece info), set that as the basePath instead
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
          {location.state?.initialPath && 
            (<button
              onClick={() =>
                navigate(-1)
              }
              className="back-arrow-btn mb-4"
            >
              <ArrowLeft size={20} />
            </button>)}
          <h1 className="mb-5">Digital Catalogue</h1>
          {basePath ? <DigitalCatalogueFolders folderPath={basePath} /> : <p>Digital Catalogue data not found. Please make sure the folder exists on your computer and set the folder location in <strong>Settings.</strong></p>}
        </div>
    )
}

export default DigitalCatalogue;