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
// Edit piece even if some info is empty (call number)

// Add a global state of search criteria and a back button from piece info, global state of holdings?

// css file
// Search filters are very tightly coupled!

// How to fetch and store entire holdings initially? Composer alphabetically?
// Remove all the ds stores from the catalogue page

// Something more enticing for home page? Photos of Woolsey, rehearsals?
// Style reports page

// Fix buttons and bootstrap default colors

// Alerts on success for cataloguing, logging in, etc.
// when editing a piece from the manage holdings page, it should not redirect you away but open an edit mode

// Need to dispatch an iniital folder being set from digital catalogue page

export default Home;
