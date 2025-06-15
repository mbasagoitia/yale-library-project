import { Table } from 'react-bootstrap';
import formatDate from "../../helpers/general/formatDate";

const InfoTable = ({ data }) => {
    const { first_name, last_name, publisher,acquisition_date, call_number, public_domain, own_digital, scans_url, condition, additional_notes } = data;
        return (
            <Table striped bordered className="mt-3">
                <tbody>
                <tr>
                    <td><strong>Composer</strong></td>
                    <td>{`${first_name} ${last_name}`}</td>
                </tr>
                <tr>
                    <td><strong>Publisher</strong></td>
                    <td>{publisher}</td>
                </tr>
                <tr>
                    <td><strong>Acquisition Date</strong></td>
                    <td>{acquisition_date ? formatDate(acquisition_date) : "Unknown"}</td>
                </tr>
                <tr>
                    <td><strong>Call Number</strong></td>
                    <td>{call_number}</td>
                </tr>
                <tr>
                    <td><strong>Public Domain</strong></td>
                    <td>{public_domain ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td><strong>Digital Scans</strong></td>
                    <td>
                    {own_digital ? <a href={scans_url} target="_blank" rel="noreferrer" className="ml-2">Yes</a> : "No"}
                    </td>
                </tr>
                <tr>
                    <td><strong>Condition</strong></td>
                    <td>{condition}</td>
                </tr>
                {additional_notes && (
                    <tr>
                    <td><strong>Additional Notes</strong></td>
                    <td>{additional_notes}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        )
}

export default InfoTable;