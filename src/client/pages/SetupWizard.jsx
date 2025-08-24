import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const checkDefaultPath = async () => {
      const { exists, basePath } = await window.api.filesystem.getBasePath(); 
      if (exists) {
        setDefaultPath(basePath);
        setFolderPath(basePath);
        setDefaultPathExists(true);
      } else {
        setDefaultPath("User/Documents/philharmonia_library_digital_catalogue");
        setDefaultPathExists(false);
      }
    };
    checkDefaultPath();
  }, []);

  const handleChooseFolder = async () => {
    const newPath = await window.api.filesystem.openFolderDialog();
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
    console.log("setup complete");
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
      title: "Check Catalogue Folder",
      content: (
        <>
          <p className="mb-4">Checking for catalogue folder at:</p>
          <p className="font-mono text-sm mb-4">{defaultPath}</p>
          {defaultPathExists ? (
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircle className="mr-2" /> Folder found!
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2" /> Folder not found.
              </div>
              <Button onClick={handleChooseFolder}>
                <Folder className="mr-2 h-4 w-4" /> Choose Folder
              </Button>
            </div>
          )}
        </>
      ),
    },
    {
      id: 3,
      title: "Admin Access",
      content: (
        <>
          <p className="mb-4">Librarians with admin access can manage settings and add other admins.</p>
          <p className="mb-4">If you need admin access, please contact your system administrator.</p>
        </>
      ),
    },
  ];

  return (
    <div className="setup-wizard max-w-xl mx-auto mt-10">
      <Card className="p-6 shadow-lg rounded-2xl">
        <motion.h2
          key={steps[step - 1].title}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold mb-4"
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
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button variant="default" onClick={handleFinishSetup}>Finish</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SetupWizard;
