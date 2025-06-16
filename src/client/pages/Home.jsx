import HomeCards from '../components/general/HomeCards';

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
// Edit piece even if some info is empty (call number)

// Add a global state of search criteria and a back button from piece info
// Style the navbar

// Digital Catalogue

// Style this page!
// Pagination

// Clean up preload.js and fix naming convention
// Search filters are very tightly coupled!

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
// Export options: Let librarians export as PDF

// Server vs electron logic?


export default Home;
