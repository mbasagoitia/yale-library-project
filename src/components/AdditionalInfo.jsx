import React, { useState } from "react";
import { Form, FormGroup, FormCheck, FormLabel, FormControl, Button } from "react-bootstrap";
import conditions from "./conditions";

const AdditionalInfo = () => {
    const [ownPhysical, setOwnPhysical] = useState(true);
    const [ownDigital, setOwnDigital] = useState(false);
    const [ownScore, setOwnScore] = useState(true);
    const [condition, setCondition] = useState(conditions[0].id);
    const [missingParts, setMissingParts] = useState(false);
    const [notes, setNotes] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const handleConditionSelect = (id) => {
        setCondition(id);
    }

    const handleMissingPartsSelect = (e) => {
        const missing = e.target.id === "missingYes";
        setMissingParts(missing);
        if (!missing) {
            setNotes("");
            setFormErrors({});
        }
    }

    const handleAdditionalNotes = (e) => {
        setNotes(e.target.value);
        if (missingParts && !e.target.value.trim()) {
            setFormErrors({ notes: "Please specify which parts are missing." });
        } else {
            setFormErrors({});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (missingParts && !notes.trim()) {
            setFormErrors({ notes: "Please specify which parts are missing." });
        } else {
            // Send information to database and catalogue new piece.
            // Logging to console for now.
            console.log({
                ownPhysical,
                ownDigital,
                ownScore,
                condition,
                missingParts,
                notes
            });
            // Reset form
            setOwnPhysical(true);
            setOwnDigital(false);
            setOwnScore(true);
            setCondition(conditions[0].id);
            setMissingParts(false);
            setNotes("");
            setFormErrors({});
        }
    }

    return (
        <div className="additionalInfo">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel>Media Type</FormLabel>
                    <div>
                        <FormCheck 
                            type="checkbox" 
                            id="physical" 
                            label="Physical Parts" 
                            checked={ownPhysical}
                            onChange={() => setOwnPhysical(!ownPhysical)}
                        />
                        <FormCheck 
                            type="checkbox" 
                            id="digital" 
                            label="Digital Scans" 
                            checked={ownDigital}
                            onChange={() => setOwnDigital(!ownDigital)}
                        />
                        <FormCheck 
                            type="checkbox" 
                            id="score" 
                            label="Score" 
                            checked={ownScore}
                            onChange={() => setOwnScore(!ownScore)}
                        />
                    </div>
                </FormGroup>

                <FormGroup>
                    <FormLabel>Select Condition:</FormLabel>
                    <div>
                        {conditions.map((item) => (
                            <FormCheck 
                                key={item.id} 
                                type="radio" 
                                id={`conditionRadio${item.id}`} 
                                label={item.label} 
                                checked={condition === item.id} 
                                onChange={() => handleConditionSelect(item.id)}
                            />
                        ))}
                    </div>
                </FormGroup>

                <FormGroup>
                    <FormLabel>Is this set missing any parts?</FormLabel>
                    <div>
                        <FormCheck 
                            type="radio" 
                            id="missingYes" 
                            label="Yes" 
                            checked={missingParts}
                            onChange={handleMissingPartsSelect}
                        />
                        <FormCheck 
                            type="radio" 
                            id="missingNo" 
                            label="No" 
                            checked={!missingParts}
                            onChange={handleMissingPartsSelect}
                        />
                    </div>
                </FormGroup>

                <FormGroup>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl 
                        as="textarea" 
                        rows={3} 
                        onChange={handleAdditionalNotes}
                        value={notes}
                        isInvalid={!!formErrors.notes}
                    />
                    <FormControl.Feedback type="invalid">{formErrors.notes}</FormControl.Feedback>
                </FormGroup>

                <Button type="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default AdditionalInfo;
