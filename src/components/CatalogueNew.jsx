import { useState } from "react";
import CallNumber from "../components/CallNumber";
import AdditionalInfo from "../components/AdditionalInfo";

const CatalogueNew = () => {
    const [callNumber, setCallNumber] = useState("");
    
    return (
        <div className="catalogueNew">
            <CallNumber setCallNumber={setCallNumber} />
            <AdditionalInfo callNumber={callNumber} />
        </div>
    )
}

export default CatalogueNew;