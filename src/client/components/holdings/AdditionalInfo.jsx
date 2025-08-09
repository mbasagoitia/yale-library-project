import { FormGroup, FormCheck, FormLabel, FormControl, Row, Col, Container } from "react-bootstrap";
import conditions from "./conditions";
import Tooltip from "./Tooltip";
import PDTooltip from "./tooltip-contents/PDTooltip";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    const handlePdSelect = (e) => {
        const pd = e.target.id === "pdYes";
        setAdditionalInfo(prevState => ({ ...prevState, publicDomain: pd }));
    }

    const handleScansUrl = (e) => {
        const url = e.target.value;
        setAdditionalInfo(prevState => ({ ...prevState, scansUrl: url }))
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

    const handleLastPerformedSelect = (date) => {
        setAdditionalInfo((prev) => ({
            ...prev,
            lastPerformed: date ? date.toISOString() : null,
          }))
      };

      const handleAcquisitionDateSelect = (date) => {
        setAdditionalInfo((prev) => ({
            ...prev,
            acquisitionDate: date ? date.toISOString() : null,
          }))
      };    

    const handleMediaTypeChange = (key) => {
        setAdditionalInfo(prevState => ({ ...prevState, [key]: !prevState[key] }));
    }

    return (
        <Container className="additionalInfo">
            <FormGroup as={Row} className="mt-2">
                <FormLabel as="legend" column sm={4} className="my-2">Holdings Type</FormLabel>
                <Col sm={8} className="my-2">
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
                            
                    {additionalInfo.ownDigital && (
                        <>
                        <FormLabel className="mt-4 mb-2 w-100 text-left">Link to Digital Scans:</FormLabel>
                        <FormControl 
                            as="input" 
                            onChange={(e) => handleScansUrl(e)}
                            value={additionalInfo.scansUrl}
                        />
                        </>
                    )}
                </Col>
            </FormGroup>

            <FormGroup as={Row} className="mt-2 lg-border">
                <FormLabel as="legend" column sm={4} className="my-2">Is this piece in the public domain? <Tooltip content={<PDTooltip />} /></FormLabel>
                <Col sm={8} className="my-2">
                    <FormCheck 
                        type="radio" 
                        id="pdYes" 
                        label="Yes" 
                        checked={additionalInfo.publicDomain}
                        onChange={handlePdSelect}
                    />
                    <FormCheck 
                        type="radio" 
                        id="pdNo" 
                        label="No" 
                        checked={!additionalInfo.publicDomain}
                        onChange={handlePdSelect}
                    />
                </Col>
            </FormGroup>

            <FormGroup as={Row} className="mt-2 lg-border">
                <FormLabel as="legend" column sm={4} className="my-2">Condition</FormLabel>
                <Col sm={8} className="my-2">
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

            <FormGroup as={Row} className="mt-2 lg-border">
                <FormLabel as="legend" column sm={4} className="my-2">Is this set missing any parts?</FormLabel>
                <Col sm={8} className="my-2">
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

            <FormGroup as={Row} className="mt-2 lg-border">
                <FormLabel as="legend" column sm={4} className="my-2">
                    Acquisition Date
                </FormLabel>
                <Col sm={8} className="my-2">
                <DatePicker
                    selected={
                        additionalInfo.acquisitionDate
                        ? new Date(additionalInfo.acquisitionDate)
                        : null
                    }
                    onChange={handleAcquisitionDateSelect}
                    className="form-control"
                    dateFormat="MM-dd-yyyy"
                    isClearable
                    placeholderText="Select date"
                />
                </Col>
            </FormGroup>

            <FormGroup as={Row} className="mt-2 lg-border">
                <FormLabel as="legend" column sm={4} className="my-2">
                    Date last performed (if known)
                </FormLabel>
                <Col sm={8} className="my-2">
                <DatePicker
                    selected={
                        additionalInfo.lastPerformed
                        ? new Date(additionalInfo.lastPerformed)
                        : null
                    }
                    onChange={handleLastPerformedSelect}
                    className="form-control"
                    dateFormat="MM-dd-yyyy"
                    isClearable
                    placeholderText="Select date"
                />
                </Col>
            </FormGroup>

            <FormGroup as={Row} className="mt-4 lg-border">
                <FormLabel column sm={4} className="my-2">Additional Notes</FormLabel>
                <Col xs={12} className="my-2">
                    <FormControl 
                        as="textarea" 
                        rows={3} 
                        onChange={handleAdditionalNotes}
                        value={additionalInfo.notes}
                        isInvalid={!!formErrors.missingPartsWarning}
                    />
                    <FormControl.Feedback type="invalid">{formErrors.missingPartsWarning}</FormControl.Feedback>
                </Col>
            </FormGroup>
        </Container>
    );
}

export default AdditionalInfo;
