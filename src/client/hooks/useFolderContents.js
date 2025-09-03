import { useState, useEffect } from "react";

export const useFolderContents = (initialPath) => {
  const [contents, setContents] = useState([]);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const fetchDirectory = async (path) => {
    if (!path) return;

    const result = await window.api.filesystem.listDirectory(path);

    // Filter hidden/system files
    const filtered = result.filter(item => !item.name.startsWith('.'));

    setContents(filtered);
    setCurrentPath(path);

    // Normalize for splitting
    const normalized = path.replace(/\\/g, "/");
    const parts = normalized.split("/").filter(Boolean);

    setBreadcrumbs(parts);
  };

  useEffect(() => {
    fetchDirectory(initialPath);
  }, [initialPath]);

  const goUp = () => {
    const normalized = currentPath.replace(/\\/g, "/");
    const parts = normalized.split("/").filter(Boolean);

    if (parts.length === 0) return;
    parts.pop();

    // Reconstruct with leading slash (for absolute paths)
    const parentPath = normalized.startsWith("/") 
      ? "/" + parts.join("/") 
      : parts.join("/");

    fetchDirectory(parentPath);
  };

  return {
    contents,
    currentPath,
    breadcrumbs,
    navigateTo: fetchDirectory,
    goUp,
  };
};
