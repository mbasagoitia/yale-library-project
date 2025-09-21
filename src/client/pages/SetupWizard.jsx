import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "../../assets/styles/pages/SetupWizard.css";

import WelcomeCard from "../components/setup-wizard/WelcomeCard.jsx";
import SetFolderCard from "../components/setup-wizard/SetFolderCard.jsx";
import AdminPermissionCard from "../components/setup-wizard/AdminPermissionCard.jsx";

const SetupWizard = () => {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: "Welcome", component: <WelcomeCard /> },
    { id: 2, title: "Scan for Digital Catalogue Folder", component: <SetFolderCard /> },
    { id: 3, title: "Administrative Access", component: <AdminPermissionCard /> },
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="setup-wizard max-w-xl mx-auto mt-10 d-flex flex-column justify-content-center align-items-center">
      <div className="setup-wizard-content w-100">
        <Card className="p-6 shadow-lg rounded-2xl h-100">
          <Card.Header>
            <h5 className="mb-0">Setup Wizard</h5>
          </Card.Header>
          <Card.Body className="mb-6">
            <motion.h2
              key={currentStep.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold mb-4"
            >
              {currentStep.title}
            </motion.h2>

            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep.component}
            </motion.div>

            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < steps.length ? (
                <Button onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => window.api.setup.setupComplete()}
                >
                  Finish
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
