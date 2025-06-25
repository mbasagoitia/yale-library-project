import { useEffect, useState } from 'react';
import fetchResourceData from '../helpers/holdings/fetchResourceData';

const useFetchResourceData = () => {
  const [resourceData, setResourceData] = useState({
    mediumData: [],
    composerData: [],
    speciesData: [],
    publisherData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resources = await fetchResourceData();
        setResourceData({
          mediumData: resources[0],
          composerData: resources[1],
          speciesData: resources[2],
          publisherData: resources[3],
        });
      } catch (error) {
        console.error("Error fetching resource data:", error);
      }
    };
    fetchData();
  }, []);

  return resourceData;
};

export default useFetchResourceData;
