import { useState } from "react";

const MissingCatalogueNotice = ({ onPathSet }) => {
  const [error, setError] = useState("");

  const handleSelectFolder = async () => {
    try {
      const folder = await window.api.setup.selectFolder();
      if (folder) {
        await window.api.setup.setBasePath(folder);
        onPathSet(folder);
      }
    } catch (err) {
      setError("Failed to set new path");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-4 items-center justify-center">
      <h2 className="text-xl font-semibold">Catalogue Path Missing</h2>
      <p className="text-gray-600 text-center">
        The folder previously set for the catalogue no longer exists on your system.
        Please select a new folder to continue.
      </p>
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
        onClick={handleSelectFolder}
      >
        Select New Folder
      </button>
    </div>
  );
};

export default MissingCatalogueNotice;
