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
// Same with css file
// Search filters are very tightly coupled!

// Style the modals
// Style the manage holdings page
// Something more enticing for home page? Reports?

// Server vs electron logic?
// Auth middleware, make sure to make all protected routes have this


export default Home;
