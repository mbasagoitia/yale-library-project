import { useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { FileText } from "lucide-react";
import { Button } from "react-bootstrap";
import PDFViewer from "./PDFViewer";
import Modal from "./Modal";
import "../../../assets/styles/components/Header.css";
import { toast } from "react-toastify";

const Header = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    
    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const handleClosePdfModal = () => {
        setPdfModalOpen(false);
        setModalOpen(false);
    }

    const isDemo =
    process.env.REACT_APP_APP_MODE === 'demo' ||
    process.env.REACT_APP_CAS_ENABLED === 'false';
  
    const manualFilePath = isDemo
    ? "/manuals/demo/user_manual_demo.pdf"
    : "/manuals/internal/user_manual.pdf";
  
    const saveManual = async () => {
        if (window?.api?.filesystem?.savePublicFile) {
          const result = await window.api.filesystem.savePublicFile(manualFilePath, "philharmonia_library_catalogue_user-manual.pdf");
          if (!result.canceled && result.success) {
            toast.success("Saved user manual");
            handleCloseModal();
          } else if (!result.canceled) {
            toast.error("Error saving file");
          }
        }
      }

    return (
    <header className="App-header">
        <div className="header-content">
            <div className="site-header d-flex justify-content-between">
                <div><a href="https://www.yale.edu" target="_blank" rel="noreferrer">Yale University</a></div>
                <button className="help-btn" onClick={() => setModalOpen(true)}>
                <CiCircleQuestion size={28} />
                </button>
            </div>
            <hr></hr>
            <h1 className="site-title">Philharmonia Library</h1>
        </div>
        <Modal
            show={modalOpen}
            header={"User Manual"}
            content={
              <div>
            <div className="flex gap-2">
                <Button onClick={() => setPdfModalOpen(true)}><FileText className="mr-2 h-4 w-4" /> Open Manual</Button>
                <Button variant="outline" onClick={saveManual}><FileText className="mr-2 h-4 w-4" /> Save Manual</Button>
                <Modal
                show={pdfModalOpen}
                header={"User Manual"}
                content={
                <div>
                    <PDFViewer filePath={manualFilePath} fileLocation={"public"} />
                </div>
                }
                handleCloseModal={handleClosePdfModal}
            />
          </div>
              </div>
            }
            handleCloseModal={handleCloseModal}
          />
    </header>
    )
}

export default Header;