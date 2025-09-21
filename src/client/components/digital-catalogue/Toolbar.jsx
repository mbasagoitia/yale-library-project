import React from "react";
import { Button } from "react-bootstrap";
import Searchbar from "../search-filters/Searchbar";
import CreateFolderModal from "../general/CreateFolderModal";

const Toolbar = ({
  currentPath,
  rootPath,
  onNavigateUp,
  onCreateFolder,
  onAddPDF,
  searchText,
  setSearchText,
  showCFModal,
  setShowCFModal,
}) => (
  <>
    {!currentPath ? (
      <Searchbar placeholder="Search by name..." value={searchText} onSearch={setSearchText} />
    ) : null}

    <div className="dc-nav-info my-4">
      <Button
        variant="outline-primary"
        onClick={onNavigateUp}
        disabled={!currentPath || currentPath === rootPath}
        className="prev-folder-btn"
      >
        ← Previous
      </Button>

      <Button onClick={() => setShowCFModal(true)}>+ Add Folder</Button>
      <CreateFolderModal
        show={showCFModal}
        onClose={() => setShowCFModal(false)}
        onCreate={onCreateFolder}
      />
      {currentPath !== rootPath && (
        <Button variant="success" onClick={onAddPDF}>
          + Add PDF Files
        </Button>
      )}
    </div>
  </>
);

export default Toolbar;
