import { useState, useEffect } from "react";

export const useFolderContents = (initialPath) => {
  
  const [contents, setContents] = useState([]);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const fetchDirectory = async (path) => {
    console.log(path);
    const result = await window.api.digitalCatalogue.listDirectory(path);

    // Filter out .DS_Store and other system files that I don't need to be displayed
    const filtered = result.filter(item => !item.name.startsWith('.'));

    setContents(filtered);
    setCurrentPath(path);

    const normalizedPath = path.replace(/\\/g, '/');
    setBreadcrumbs(normalizedPath.split('/').filter(Boolean));
  };

  useEffect(() => {
    fetchDirectory(initialPath);
  }, [initialPath]);

  return {
    contents,
    currentPath,
    breadcrumbs,
    navigateTo: fetchDirectory,
    goUp: () => {
      const parts = currentPath.replace(/\\/g, '/').split('/').filter(Boolean);
      if (parts.length === 0) return;
      parts.pop();
      fetchDirectory(parts.join('/'));
    },
  };
};
