import ReportForm from "../components/reports/ReportForm";
import "../../assets/styles/pages/ReportsPage.css";

const Reports = () => {
    return (
        <div className="reports">
            <h1>Library Reports</h1>
            <div className="report-page-container d-flex gap-4">
                <ReportForm />
                <div className="reports-description">
                    <p>Generate a variety of insightful reports to help you effectively manage and track the performance library.</p>
                    <ul>
                        <li>
                            <strong>All Holdings</strong>
                            <p>View a complete list of the library's holdings and all details including condition, notes, acquisition date, etc.</p>
                        </li>
                        <li>
                            <strong>Missing Parts</strong>
                            <p>Identify all holdings that contain missing parts. Helps to plan replacement purchases.</p>
                        </li>
                        <li>
                            <strong>Poor Condition</strong>
                            <p>Track items that are in poor or fair condition. Prioritize repairs or replacements, maintaining the library's integrity over time.</p>
                        </li>
                        <li>
                            <strong>Condition Summary</strong>
                            <p>Get a snapshot of the overall condition of your holdings. This summary helps you monitor the health of your library and plan for any necessary updates or maintenance.</p>
                        </li>
                        <li>
                            <strong>By Composer</strong>
                            <p>Filter the collection by composer to see which pieces you have from each one. This is great for curating performances or researching a specific composer's work.</p>
                        </li>
                        <li>
                            <strong>Performance History</strong>
                            <p>Review the history of performances tied to specific pieces. Track usage and identify frequently performed works and plan future performances accordingly.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Reports;