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


// Make the search bar and filters functional

// Add fields to update acquisition date and date last performed

// Add a global state of search criteria and a back button from piece info, global state of holdings?

// css file

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page

// Fix buttons and bootstrap default colors

// Alerts on success for cataloguing, logging in, etc.
// when editing a piece from the manage holdings page, it should not redirect you away but open an edit mode
// Immediately update state of holdings when you add a new piece

// Renew authToken logic

export default Home;
