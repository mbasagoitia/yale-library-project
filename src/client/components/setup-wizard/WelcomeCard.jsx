import { useState } from "react";
import { Button } from "react-bootstrap";
import { FileText } from "lucide-react";
import Modal from "../../components/general/Modal";
import PDFViewer from "../../components/general/PDFViewer";
import cfg from "../../../config/appConfig.js";
import { toast } from "react-toastify";

const WelcomeCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const isDemo = cfg.isDemo;
  const manualFilePath = isDemo
    ? "/manuals/demo/user_manual_demo.pdf"
    : "/manuals/internal/user_manual.pdf";

  const saveManual = async () => {
    if (window?.api?.filesystem?.savePublicFile) {
      const result = await window.api.filesystem.savePublicFile(
        manualFilePath,
        "philharmonia_library_catalogue_user-manual.pdf"
      );
      if (!result.canceled && result.success) toast.success("Saved user manual");
      else if (!result.canceled) toast.error("Error saving file");
    }
  };

  return (
    <>
      <p className="mb-4">Welcome to the Philharmonia Library Catalogue!</p>
      <p className="mb-4">You can open or save the user manual below.</p>
      <div className="flex gap-2">
        <Button onClick={() => setModalOpen(true)}>
          <FileText className="mr-2 h-4 w-4" /> Open Manual
        </Button>
        <Button variant="outline" onClick={saveManual}>
          <FileText className="mr-2 h-4 w-4" /> Save Manual
        </Button>
      </div>
      <Modal
        show={modalOpen}
        header="User Manual"
        content={<PDFViewer filePath={manualFilePath} fileLocation="public" />}
        handleCloseModal={() => setModalOpen(false)}
      />
    </>
  );
};

export default WelcomeCard;
