import React from "react";
import CatalogueCard from "./CatalogueCard";

const CatalogueGrid = ({ items, onClick, onMove, onDelete }) => (
  <div className="manage-dc-container d-flex">
    {items.map((item) => (
      <CatalogueCard
        key={item.relativePath}
        item={item}
        onClick={() => onClick(item)}
        onMove={() => onMove(item)}
        onDelete={() => onDelete(item)}
      />
    ))}
  </div>
);

export default CatalogueGrid;
