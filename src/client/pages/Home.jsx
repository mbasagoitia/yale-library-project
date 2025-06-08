import HomeCards from '../components/HomeCards';

const Home = () => {
      
    return (
        <div className="home">
            <h1 className='text-center'>Yale Philharmonia Library Catalogue</h1>
            <div className="mt-4">
                <HomeCards />
            </div>
        </div>
    );
};

// Call number needs to be correctly reflected on submit even if the user doesn't generate it
// Add field to update acquisition date
// Fix buttons and bootstrap default colors
// Make the search bar and filters functional

// Add a global state of search criteria and a back button from piece info

// Settings Page

// Add / remove admin by NetID
// Default folder location for digital holdings
// Backup/export database (JSON/CSV download)

// Digital Catalogue

// Use Google Drive's embed view or file previews
// (e.g., embed a viewer for PDF previews if you can link directly)
// For each piece:
// Show piece info
// Show “View Digital Score” button → opens scan in a modal or new tab
// Add Google Drive icon next to link
// If using thumbnails or icons:
// Show a small icon (PDF, image, etc.) to indicate file type
// Consider adding “Uploaded on” date or “Last accessed”
// Bonus: If you want elegance — auto-fetch Drive preview thumbnails using Google Drive API (optional, needs setup).

// Reports

// Parts with Missing Material
// Poor Condition
// Last Performed
// Most Recently Performed
// Top 10 Most Performed
// Good visual chart here — use bar chart!
// Recently Added (last 30 days)

// Use charts: Recharts (simple React chart lib) or Chart.js
// For lists: Tables with filtering/sorting (e.g., DataTables, or React Table)
// Export options: Let librarians export as PDF/CSV

// History of Changes: log who edited what and when


export default Home;
