import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";
import generateCallNum from "../helpers/generateCallNum.js";

const CatalogueNew = () => {
    // General info that goes into database for each piece
    const [mainInfo, setMainInfo] = useState({
        title: "",
        opus: "",
        number: "",
        medium: {},
        composer: {},
        genre: {},
        publisher: {},
        callNumber: []
    })

    const [additionalInfo, setAdditionalInfo] = useState({
        ownPhysical: true,
        ownDigital: false,
        ownScore: true,
        condition: 1,
        missingParts: false,
        notes: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [showCall, setShowCall] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleShowCall = () => {
        const { medium, composer, genre, publisher } = mainInfo;

        if (medium && composer && genre && publisher) {
            const call = generateCallNum(mainInfo);
            setMainInfo({ ...mainInfo, callNumber: call });
            setShowCall(true);
        } else {
            console.log("not enough info for call num");
            setFormErrors({ notes: "Please fill in all required fields." });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { title, medium, composer, genre, publisher, callNumber } = mainInfo;

        if (title && medium && composer && genre && publisher && callNumber) {
            if (additionalInfo.missingParts && !additionalInfo.notes.trim()) {
                setFormErrors({ notes: "Please specify which parts are missing." });
            } else {
                // Send information to database and catalogue new piece.
                console.log(mainInfo, additionalInfo);
                setSubmitted(true);

                // Reset form
                setMainInfo({
                    title: "",
                    opus: "",
                    number: "",
                    medium: {},
                    composer: {},
                    genre: {},
                    publisher: {},
                    callNumber: []
                });

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
        } else {
            setFormErrors({ notes: "Please fill in all required fields." });
        }
    }
    
    return (
        <div className="catalogueNew">
            <h1>New Piece Information</h1>
            <form onSubmit={handleSubmit}>
                <MainInfo mainInfo={mainInfo} setMainInfo={setMainInfo} formErrors={formErrors} />
                <Button onClick={(e) => handleShowCall(e)} className="btn btn-primary my-2">Generate Call Number</Button>
                {showCall && (
                    <div className="alert alert-success d-flex flex-column align-items-center my-4" role="alert">
                    <h4>Call Number:</h4>
                    <div>
                    {mainInfo.callNumber?.map((line, index) => (
                        <div className="callNumLine" key={index}>{line}</div>
                    ))}
                    </div>
                    </div>
                )}
                <div>
                    <AdditionalInfo additionalInfo={additionalInfo} setAdditionalInfo={setAdditionalInfo} formErrors={formErrors} setFormErrors={setFormErrors} />
                </div>
            </form>
        </div>
    )
}

export default CatalogueNew;
