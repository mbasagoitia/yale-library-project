import React, { useState } from "react";
import { Form, FormGroup, FormCheck, FormLabel, FormControl, Button, Row, Col } from "react-bootstrap";
import conditions from "./conditions";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdditionalInfo = ({ callNumber }) => {
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
                <FormGroup as={Row} className="mt-2">
                    <FormLabel as="legend" column sm={2}>Media Type</FormLabel>
                    <Col sm={10}>
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
                    </Col>
                </FormGroup>

                <FormGroup as={Row} className="mt-2">
                    <FormLabel as="legend" column sm={2}>Condition</FormLabel>
                    <Col sm={10}>
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
                    </Col>
                </FormGroup>

                <FormGroup as={Row} className="mt-2">
                    <FormLabel as="legend" column sm={2}>Is this set missing any parts?</FormLabel>
                    <Col sm={10}>
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
                    </Col>
                </FormGroup>

                <FormGroup as={Row} className="mt-2">
                    <FormLabel column sm={2}>Additional Notes</FormLabel>
                    <Col sm={10}>
                        <FormControl 
                            as="textarea" 
                            rows={3} 
                            onChange={handleAdditionalNotes}
                            value={notes}
                            isInvalid={!!formErrors.notes}
                        />
                        <FormControl.Feedback type="invalid">{formErrors.notes}</FormControl.Feedback>
                    </Col>
                </FormGroup>

                <FormGroup as={Row} className="mt-4">
                    <Col sm={{ span: 10, offset: 1 }}>
                        <Button type="submit">Catalogue</Button>
                    </Col>
                </FormGroup>
            </Form>
        </div>
    );
}

export default AdditionalInfo;
