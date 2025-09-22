import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { Container } from "react-bootstrap";
import renderIdAndNumber from "../helpers/holdings/renderIdAndNumber.js";
import InfoTable from "../components/holdings/InfoTable.jsx";
import "../../assets/styles/pages/PieceInfoPage.css";
import { toast } from "react-toastify";

const PieceInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.page;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/holdings-data/${id}`);
        if (!res.ok) toast.error("Network response was not ok");
        const data = await res.json();
        setData(data);
      } catch {
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <Container>
        {data && (
          <>
            <button
              onClick={() =>
                navigate("/browse-holdings", { state: { page: fromPage ?? 1 } })
              }
              className="back-arrow-btn mb-4"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="mb-5">
              {data.title} {renderIdAndNumber(data)}
            </h1>
            <InfoTable data={data} />
          </>
        )}
      </Container>
    </div>
  );
};

export default PieceInfo;
