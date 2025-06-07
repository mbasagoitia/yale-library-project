import { useState, useEffect } from "react";

const Home = () => {
      
    return (
        <div className="home">

        </div>
    );
};

// Call number needs to be correctly reflected on submit even if the user doesn't generate it
// Add field to update acquisition date
// Fix buttons and bootstrap default colors
// Make the search bar and filters functional

// Add a global state of search criteria and a back button from piece info
// Add admin

// What kinds of reports to generate?

// Home Page

// Welcome message (e.g., “Welcome to the Yale Philharmonia Library Catalogue”)
// Quick stats:
// Total pieces in holdings
// Number of digital scans available
// Last piece added / last performance date
// Quick search bar
// “Recently Added” or “Featured Works”
// Link buttons to:
// Browse Holdings
// Classification Guide
// Reports (if logged in as admin)
// Logo or photo (e.g., orchestral image, shelves of scores)
// Maybe a quote about music or archiving if you want some human touch

// Settings Page

// Add / remove admin by NetID
// Manage user permissions (if expanded in the future)
// Default values or presets for:
// Classification types
// Editions
// Default folder location for digital holdings
// App appearance settings? (Light/dark mode toggle, if relevant)
// Backup/export database (JSON/CSV download)
// Manual re-sync button if you integrate APIs or digital scan syncing in the future

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
// E.g., “Missing 2nd Horn in [Piece X]”
// Poor Condition
// “Score in fair condition” / “Parts yellowed or torn”
// Last Performed: Never
// Could help conductors/librarians revive underused rep
// Most Recently Performed
// "Most active works"
// Digital Holdings Missing
// Flag pieces with no digital scan
// Top 10 Most Performed
// Good visual chart here — use bar chart!
// Recently Added (last 30 days)

// Use charts: Recharts (simple React chart lib) or Chart.js
// For lists: Tables with filtering/sorting (e.g., DataTables, or React Table)
// Export options: Let librarians export as PDF/CSV

// History of Changes: log who edited what and when


export default Home;
