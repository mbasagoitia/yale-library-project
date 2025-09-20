import { useState } from "react";
import addNewAdmin from "../../helpers/auth/addNewAdmin";
import { Button, Card, Form } from "react-bootstrap";
import { toast } from 'react-toastify';

const NewAdminForm = () => {
    const [adminInfo, setAdminInfo] = useState({ name: "", netid: "" });

    const handleAddAdmin = async (e) => {
        e.preventDefault();
    
        if (!adminInfo.name || !adminInfo.netid) {
          toast.error("Please make sure to fill out all fields.");
          return;
        }
    
        const result = await addNewAdmin(adminInfo);
        if (result?.message) {
          toast.success(result.message);
          setAdminInfo({ name: "", netid: "" });
        }
      };

    return (
        <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAddAdmin}>
            <Form.Group className="mb-3" controlId="nameInput">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={adminInfo.name}
                onChange={(e) =>
                  setAdminInfo({ ...adminInfo, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="netidInput">
              <Form.Label>NetID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Yale NetID"
                value={adminInfo.netid}
                onChange={(e) =>
                  setAdminInfo({ ...adminInfo, netid: e.target.value })
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add New Admin
            </Button>
          </Form>
        </Card.Body>
      </Card>
    )
}

export default NewAdminForm;