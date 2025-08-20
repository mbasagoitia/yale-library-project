import { useState, useEffect } from "react";
import { FormGroup, FormCheck, FormLabel, FormControl, Row, Col, Container, Button } from "react-bootstrap";
import conditions from "./conditions";
import Tooltip from "./Tooltip";
import PDTooltip from "./tooltip-contents/PDTooltip";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdditionalInfo = ({ additionalInfo, setAdditionalInfo, formErrors, setFormErrors }) => {

    // Initial for scansUrl? Should be ok, but double check
    // Change scansUrl to null when digital scans is unselected

    const [basePath, setBasePath] = useState(null);

    useEffect(() => {
        const fetchBasePath = async () => {
            if (window.api?.filesystem.getBasePath) {
              const result = await window.api.filesystem.getBasePath();
              if (result) {
                setBasePath(result);
              }
            }
          };
      
          fetchBasePath();
    }, []);

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

    const handleScansPath = async () => {
        if (window.api?.filesystem.setFolderPath) {
          const selectedFullPath = await window.api.filesystem.setFolderPath();
          if (selectedFullPath) {
            const basePath = await window.api.filesystem.getBasePath();
      
            // Normalize slashes to be safe
            const normalizedBase = basePath.replace(/\\/g, "/");
            const normalizedSelected = selectedFullPath.replace(/\\/g, "/");
      
            // Remove basePath from the selected path
            let relativePath = normalizedSelected;
            if (normalizedSelected.startsWith(normalizedBase)) {
              relativePath = normalizedSelected.substring(normalizedBase.length).replace(/^\/+/, "");
            }
      
            // Store only the relative path in the db
            setAdditionalInfo(prev => ({
              ...prev,
              scansUrl: relativePath
            }));
          }
        }
      };
      

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
                <Col md={6} className="my-2">
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
                    </Col>
                    <Col md={6} className="d-flex flex-column justify-content-center">
                    {additionalInfo.ownDigital && (
                        <div>
                        {basePath ? 
                            (<div className="mt-2 mt-md-0">
                                <Button onClick={handleScansPath}>Select Scans Folder</Button>
                                <div className="pathname-text text-muted mt-2">{additionalInfo.scansUrl ? additionalInfo.scansUrl : null}</div>
                            </div>)
                        : <p>Please set a base path for the digital catalogue folder.</p>
                        }
                        </div>
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
