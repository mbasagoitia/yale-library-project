import { useState } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import addComposer from "../../helpers/holdings/addComposer";
import { toast } from "react-toastify";

const AddComposer = ({ handleCloseModal }) => {
    const [composer, setComposer] = useState({
        lastName: "",
        firstName: "",
        cutterNumber: ""
    });

    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (composer.firstName && composer.lastName && composer.cutterNumber) {
            try {
                await addComposer(composer);
                handleCloseModal();
                toast.success("Successfully added composer");

                setComposer({
                    lastName: "",
                    firstName: "",
                    cutterNumber: ""
                })
            } catch (error) {
                toast.error("Error adding composer");
            }
        } else {
            setFormErrors({
                notes: "Please fill in all required fields."
            });
        }
    }

    return (
        <div className="add-composer">
        <div className={`${formErrors.notes ? "feedback my-2" : "d-none"}`}>{formErrors.notes}</div>
            <label htmlFor="composerLastName" className="form-label">Last Name:</label>
            <InputGroup>
                <FormControl
                    type="text"
                    className="form-control"
                    id="composerLastName"
                    value={composer.lastName}
                    onChange={(e) => setComposer({ ...composer, lastName: e.target.value })}
                />
            </InputGroup>

            <label htmlFor="composerLastName" className="form-label mt-2">First Name:</label>
            <InputGroup>
                <FormControl
                    type="text"
                    className="form-control"
                    id="composerFirstName"
                    value={composer.firstName}
                    onChange={(e) => setComposer({ ...composer, firstName: e.target.value })}
                />
            </InputGroup>

            <label htmlFor="composerCutter" className="form-label mt-2">Cutter Number:</label>
            <InputGroup>
                <FormControl
                    type="text"
                    className="form-control"
                    id="composerCutter"
                    value={composer.cutterNumber}
                    onChange={(e) => setComposer({ ...composer, cutterNumber: e.target.value })}
                />
            </InputGroup>
            <div className="form-label mt-2">Please visit <a href="https://web.library.yale.edu/cataloging/music/cuttera" target="_blank" rel="noreferrer">here</a> to choose an appropriate cutter number.</div>
            <div className="d-flex justify-content-center">
                <Button onClick={handleSubmit} className="btn btn-primary mt-4" type="button">Add Composer</Button>
            </div>
        </div>
    )
}

export default AddComposer;