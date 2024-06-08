import { useState } from "react";
import CallNumber from "./CallNumber";
import AdditionalInfo from "./AdditionalInfo";

const CatalogueNew = () => {
    const [title, setTitle] = useState("");
    const [callNumber, setCallNumber] = useState([]);
    const [additionalInfo, setAdditionalInfo] = useState({
        ownPhysical: true,
        ownDigital: false,
        ownScore: true,
        condition: 1,
        missingParts: false,
        notes: ""
    });

    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (additionalInfo.missingParts && !additionalInfo.notes.trim()) {
            setFormErrors({ notes: "Please specify which parts are missing." });
        } else {
            const info = {
                callNumber: callNumber,
                ownPhysical: additionalInfo.ownPhysical,
                ownDigital: additionalInfo.ownDigital,
                ownScore: additionalInfo.ownScore,
                condition: additionalInfo.condition,
                missingParts: additionalInfo.missingParts,
                notes: additionalInfo.notes
            };

            console.log(info);
            // Send information to database and catalogue new piece.

            // Reset form
            setAdditionalInfo({
                ownPhysical: true,
                ownDigital: false,
                ownScore: true,
                condition: 1,
                missingParts: false,
                notes: ""
            });
            setFormErrors({});
        }
    }
    
    return (
        <div className="catalogueNew">
            <form onSubmit={handleSubmit}>
                <CallNumber callNumber={callNumber} setCallNumber={setCallNumber} title={title} setTitle={setTitle} setFormErrors={setFormErrors} />
                <div className="mt-4">
                    <AdditionalInfo additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo} formErrors={formErrors} setFormErrors={setFormErrors} />
                </div>
            </form>
        </div>
    )
}

export default CatalogueNew;
