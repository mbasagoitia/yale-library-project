import React, { useState, useEffect } from "react";
import { Button, Modal, Dropdown } from "react-bootstrap";
import {
  Folder,
  FileText,
  Plus,
  Trash2,
  MoreVertical,
  ArrowRight,
} from "lucide-react";

const ManageDigitalCatalogue = () => {
  const [currentPath, setCurrentPath] = useState("");
  const [items, setItems] = useState([]);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [destinationPath, setDestinationPath] = useState("");

  // Get base path on mount
  useEffect(() => {
    const fetchBasePath = async () => {
      if (window.api?.filesystem.getBasePath) {
        const { exists, basePath } = await window.api.filesystem.getBasePath();
        if (exists) {
          setCurrentPath(basePath);
        }
      }
    };
    fetchBasePath();
  }, []);

  // Load directory contents
  useEffect(() => {
    if (currentPath) {
      window.api.filesystem.listDirectory(currentPath).then(setItems);
    }
  }, [currentPath]);

  // Delete
  const handleDelete = async (item) => {
    const fullPath = `${currentPath}/${item.name}`;
    await window.api.filesystem.deleteItem(fullPath);
    setItems(items.filter((i) => i.name !== item.name));
  };

  // Move
  const handleMove = async () => {
    if (!selectedItem || !destinationPath) return;
    const src = `${currentPath}/${selectedItem.name}`;
    const dest = `${destinationPath}/${selectedItem.name}`;
    await window.api.filesystem.moveItem(src, dest);
    setItems(items.filter((i) => i.name !== selectedItem.name));
    setMoveDialogOpen(false);
    setDestinationPath("");
  };

  // Open folder picker
  const openFolderPicker = async () => {
    const folder = await window.api.filesystem.selectFolder(currentPath);
    if (folder) setDestinationPath(folder);
  };

  // Create new folder
  const handleCreateFolder = async () => {
    await window.api.filesystem.createFolder(currentPath, "New Folder");
    const updated = await window.api.filesystem.listDirectory(currentPath);
    setItems(updated);
  };

  return (
    <div className="d-flex h-100">
      {/* Sidebar */}
      <div className="border-end p-2" style={{ width: "16rem" }}>
        <h5 className="fw-bold mb-2">Folders</h5>
        <ul className="list-unstyled">
          <li
            onClick={() => setCurrentPath("base/catalogue/Beethoven")}
            className="cursor-pointer"
          >
            Beethoven
          </li>
          <li
            onClick={() => setCurrentPath("base/catalogue/Mozart")}
            className="cursor-pointer"
          >
            Mozart
          </li>
        </ul>
      </div>

      {/* Main browser */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">{currentPath}</h4>
          <Button onClick={handleCreateFolder}>
            <Plus className="me-2" size={16} /> New Folder
          </Button>
        </div>

        <div className="row g-3">
          {items.map((item) => (
            <div key={item.name} className="col-4">
              <div className="border rounded p-2 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  {item.isDirectory ? (
                    <Folder size={20} />
                  ) : (
                    <FileText size={20} />
                  )}
                  <span>{item.name}</span>
                </div>

                {/* Context menu */}
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    size="sm"
                    id={`dropdown-${item.name}`}
                  >
                    <MoreVertical size={16} />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {item.isDirectory && (
                      <Dropdown.Item
                        onClick={() =>
                          setCurrentPath(`${currentPath}/${item.name}`)
                        }
                      >
                        Open
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      onClick={() => {
                        setSelectedItem(item);
                        setMoveDialogOpen(true);
                      }}
                    >
                      Move To...
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDelete(item)}
                      className="text-danger"
                    >
                      <Trash2 className="me-2" size={16} /> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Move To Modal */}
      <Modal show={moveDialogOpen} onHide={() => setMoveDialogOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Move "{selectedItem?.name}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose destination folder:</p>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={destinationPath}
              readOnly
              placeholder="No folder selected"
            />
            <Button variant="outline-secondary" onClick={openFolderPicker}>
              Browse...
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMoveDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={!destinationPath}>
            <ArrowRight className="me-2" size={16} /> Move
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageDigitalCatalogue;
