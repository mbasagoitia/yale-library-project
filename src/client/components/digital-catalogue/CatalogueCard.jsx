import React from "react";
import { Card, Button } from "react-bootstrap";
import { Trash2, MoveRight } from "lucide-react";

const CatalogueCard = ({ item, onClick, onMove, onDelete }) => (
  <div className="manage-dc-item">
    <Card className="text-center file-card h-100 position-relative" onClick={onClick} style={{ cursor: "pointer" }}>
      <Card.Body>
        <div style={{ fontSize: "3rem" }}>{item.isDirectory ? "📁" : "📄"}</div>
        <Card.Text className="mt-2" title={item.name}>{item.name}</Card.Text>
      </Card.Body>
      <div className="position-absolute top-0 end-0 m-2 d-flex gap-1" style={{ opacity: 0.85 }}>
        {item.name.endsWith(".pdf") && (
          <Button
            size="sm"
            variant="light"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMove(); }}
          >
            <MoveRight size={14} />
          </Button>
        )}
        <Button
          size="sm"
          variant="danger"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  </div>
);

export default CatalogueCard;
