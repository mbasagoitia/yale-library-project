import React from "react";
import { FormGroup, FormCheck, FormLabel, FormControl, Button, Row, Col, Container } from "react-bootstrap";
import conditions from "./conditions";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdditionalInfo = ({ additionalInfo, setAdditionalInfo, formErrors, setFormErrors }) => {

    const handleConditionSelect = (id) => {
        setAdditionalInfo(prevState => ({ ...prevState, condition: id }));
    }

    const handleMissingPartsSelect = (e) => {
        const missing = e.target.id === "missingYes";
        setAdditionalInfo(prevState => ({ ...prevState, missingParts: missing }));
        if (!missing) {
            setAdditionalInfo(prevState => ({ ...prevState, notes: "" }));
            setFormErrors({});
        }
    }

    const handleAdditionalNotes = (e) => {
        const notesValue = e.target.value;
        setAdditionalInfo(prevState => ({ ...prevState, notes: notesValue }));
        if (additionalInfo.missingParts && !notesValue.trim()) {
            setFormErrors({ notes: "Please specify which parts are missing." });
        } else {
            setFormErrors({});
        }
    }

    const handleMediaTypeChange = (key) => {
        setAdditionalInfo(prevState => ({ ...prevState, [key]: !prevState[key] }));
    }

    return (
        <Container className="additionalInfo">
            <FormGroup as={Row} className="mt-2">
                <FormLabel as="legend" column sm={2}>Holdings Type</FormLabel>
                <Col sm={10}>
                    <FormCheck 
                        type="checkbox" 
                        id="physical" 
                        label="Physical Parts" 
                        checked={additionalInfo.ownPhysical}
                        onChange={() => handleMediaTypeChange('ownPhysical')}
                    />
                    <FormCheck 
                        type="checkbox" 
                        id="digital" 
                        label="Digital Scans" 
                        checked={additionalInfo.ownDigital}
                        onChange={() => handleMediaTypeChange('ownDigital')}
                    />
                    <FormCheck 
                        type="checkbox" 
                        id="score" 
                        label="Score" 
                        checked={additionalInfo.ownScore}
                        onChange={() => handleMediaTypeChange('ownScore')}
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
                            checked={additionalInfo.condition === item.id} 
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
                        checked={additionalInfo.missingParts}
                        onChange={handleMissingPartsSelect}
                    />
                    <FormCheck 
                        type="radio" 
                        id="missingNo" 
                        label="No" 
                        checked={!additionalInfo.missingParts}
                        onChange={handleMissingPartsSelect}
                    />
                </Col>
            </FormGroup>

            <FormGroup as={Row} className="mt-4">
                <FormLabel column sm={2}>Additional Notes</FormLabel>
                <Col sm={10}>
                    <FormControl 
                        as="textarea" 
                        rows={3} 
                        onChange={handleAdditionalNotes}
                        value={additionalInfo.notes}
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
        </Container>
    );
}

export default AdditionalInfo;
