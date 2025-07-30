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


// Add fields to update acquisition date and date last performed (also add to mysql)
    // Also display date last performed

// when editing a piece from the manage holdings page, it should not redirect you away but open an edit mode
// set initial state of 00 to call number if nothing is selected

// Navbar: login/logout should be far right (accessible by profile icon), move reports to before search bar
// Make sure general search works*** memoized selector
// PDF preview needs to scale correctly on small screen sizes
// Digital catalogue path and open finder button styles on small screen
// Different icon for digital catalogue
// Reset genre and publisher on new piece submit

// css file

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page

// Fix buttons and bootstrap default colors

// Alerts on success for cataloguing, logging in, etc. What happens if login fails?

// Renew authToken logic

export default Home;
