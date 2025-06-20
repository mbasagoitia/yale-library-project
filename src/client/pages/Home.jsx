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
// Add fields to update acquisition date and date last performed
// Make the search bar and filters functional
// Make sure "no results found" text is shown when appropriate
// Edit piece even if some info is empty (call number)

// Add a global state of search criteria and a back button from piece info, global state of holdings?

// Digital Catalogue

// Pagination

// Clean up preload.js and fix naming convention
// Same with css file
// Search filters are very tightly coupled!

// Something more enticing for home page? Reports?
// Fix buttons and bootstrap default colors

// Server vs electron logic?
// Auth middleware, make sure to make all protected routes have this


export default Home;
