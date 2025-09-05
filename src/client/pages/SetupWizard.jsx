import { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { CheckCircle, XCircle, FileText, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "../../assets/styles/pages/SetupWizard.css";

const SetupWizard = () => {
  const [step, setStep] = useState(1);
  const [defaultPath, setDefaultPath] = useState("");
  const [defaultPathExists, setDefaultPathExists] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const checkDefaultPath = async () => {
    // Check to see if folder exists at expected default path (User/Documents/philharmonia_library_digital_catalogue)
    const { exists, path } = await window.api.filesystem.checkDefaultBasePath();

    setDefaultPath(path);
    if (exists) {
      setFolderPath(path) 
    // set path in electron store
    await window.api.filesystem.setBasePath(path);
    setDefaultPathExists(true)
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsScanning(false);
  }
  checkDefaultPath();
}, []);

  const handleChooseFolder = async () => {
    // No base path set, so choose from anywhere on the computer
    const defaultPath = "";
    const newPath = await window.api.filesystem.chooseFolder(defaultPath);
    if (newPath) {
      setFolderPath(newPath);
      await window.api.filesystem.setBasePath(newPath);
    }
  };

  const handleFinishSetup = async () => {
    if (!folderPath) {
      toast.error("Please choose a folder first.");
      return;
    }

    // Notify Electron setup is complete
    window.api.setup.setupComplete();
    toast.success("Setup complete!");
  };

  const steps = [
    {
      id: 1,
      title: "Welcome",
      content: (
        <>
          <p className="mb-4">Welcome to the Philharmonia Library Catalogue!</p>
          <p className="mb-4">You can open or save the user manual below.</p>
          <div className="flex gap-2">
            <Button><FileText className="mr-2 h-4 w-4" /> Open Manual</Button>
            <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Save Manual</Button>
          </div>
        </>
      ),
    },
    {
      id: 2,
      title: "Scan for Digital Catalogue Folder",
      content: (
        <>
          {isScanning ? (
            <>
              <p className="mb-4">Scanning for folder at:</p>
              <p className="font-monospace path-text mb-4">{defaultPath}</p>
              <div className="flex items-center text-muted mb-4">
                <span className="spinner-border spinner-border-sm mr-2" role="status" />
                Scanning...
              </div>
            </>
          ) : defaultPathExists ? (
            <>
              <p className="mb-4">Scanning for folder at:</p>
              <p className="font-monospace path-text mb-4">{defaultPath}</p>
              <div className="flex items-center text-success mb-4">
                <CheckCircle className="mr-2" /> Folder found!
              </div>
            </>
          ) : folderPath ? (
            <>
              <p className="mb-4">Path set to:</p>
              <p className="font-monospace path-text mb-4">{folderPath}</p>
              <div className="flex items-center text-success mb-4">
                <CheckCircle className="mr-2" /> Folder path set!
              </div>
            </>
          ) : (
            <>
              <p className="mb-4">Scanning for folder at:</p>
              <p className="font-monospace path-text mb-4">{defaultPath}</p>
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center text-danger mb-2">
                  <XCircle className="mr-2" /> Folder not found.
                </div>
                <Button onClick={handleChooseFolder}>
                  <Folder className="mr-2 h-4 w-4" /> Choose Folder
                </Button>
              </div>
            </>
          )}
        </>
      ),
    },    
    {
      id: 3,
      title: "Administrative Access",
      content: (
        <>
          <p className="mb-4">Librarians with admin access can manage this application and add other admins.</p>
          <p className="mb-4">Please see the <strong>Librarian Admin Permissions</strong> section in the user manual.</p>
        </>
      ),
    },
  ];

  return (
    <div className="setup-wizard max-w-xl mx-auto mt-10 d-flex flex-column justify-content-center align-items-center">
      <div className="setup-wizard-content">
        <Card className="p-6 shadow-lg rounded-2xl h-100">
          <Card.Header>
            <h5 className="mb-0">Setup Wizard</h5>
          </Card.Header>
          <Card.Body className="mb-6">
          <motion.h2
            key={steps[step - 1].title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold mb-2"
          >
            {steps[step - 1].title}
          </motion.h2>

          <motion.div
            key={steps[step - 1].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step - 1].content}
          </motion.div>
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            ) : <div />}

            {step < steps.length ? (
              <Button disabled={step == 2 && !folderPath} onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button variant="primary" onClick={handleFinishSetup}>Finish</Button>
            )}
          </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
