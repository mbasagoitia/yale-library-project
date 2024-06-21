import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PieceInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/holdings-data/${id}`);
        const data = await res.json();
        console.log(data[0]);
        setData(data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    // Build new component that lists piece info
    <div>
      {data && <h1>{data.title}</h1>}
    </div>
  );
}

export default PieceInfo;
