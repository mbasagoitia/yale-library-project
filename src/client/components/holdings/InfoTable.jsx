import { Table } from 'react-bootstrap';
import formatDate from "../../helpers/general/formatDate";
import { useNavigate } from "react-router-dom";

const InfoTable = ({ data }) => {
    const { first_name, last_name, genre, publisher, acquisition_date, call_number, public_domain, own_digital, scans_url, condition, date_last_performed, additional_notes } = data;

    const navigate = useNavigate();

    const navigateToScans = () => {
        if (own_digital && scans_url) {
          navigate("/digital-catalogue", {
            state: { initialPath: scans_url }
          });
        }
      };

        return (
            <Table striped bordered className="mt-3">
                <tbody>
                <tr>
                    <td><strong>Composer</strong></td>
                    <td>{`${first_name} ${last_name}`}</td>
                </tr>
                <tr>
                    <td><strong>Genre</strong></td>
                    <td>{genre}</td>
                </tr>
                <tr>
                    <td><strong>Publisher</strong></td>
                    <td>{publisher}</td>
                </tr>
                <tr>
                    <td><strong>Call Number</strong></td>
                    <td>{call_number}</td>
                </tr>
                <tr>
                    <td><strong>Acquisition Date</strong></td>
                    <td>{acquisition_date ? formatDate(acquisition_date) : "Unknown"}</td>
                </tr>
                <tr>
                    <td><strong>Date Last Performed</strong></td>
                    <td>{date_last_performed ? formatDate(date_last_performed) : "Unknown"}</td>
                </tr>
                <tr>
                    <td><strong>Public Domain</strong></td>
                    <td>{public_domain ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td><strong>Digital Scans</strong></td>
                    <td>
                    {own_digital && scans_url ? <span onClick={navigateToScans} className="ml-2 have-scans-text">Yes</span> : "No"}
                    </td>
                </tr>
                <tr>
                    <td><strong>Condition</strong></td>
                    <td>{condition}</td>
                </tr>
                {additional_notes && (
                    <tr>
                        <td><strong>Notes</strong></td>
                        <td>{additional_notes}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        )
}

export default InfoTable;