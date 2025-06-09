import { useState, useEffect } from 'react';

export const useFolderContents = (initialPath = '') => {
    
  const [contents, setContents] = useState([]);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const fetchDirectory = async (path) => {
    const result = await window.digitalCatalogueAPI.listDirectory(path);
    setContents(result);
    setCurrentPath(path);
    setBreadcrumbs(path.split('/').filter(Boolean));
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
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      fetchDirectory(parts.join('/'));
    },
  };
};
