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


// Initial data: medium and date last performed are not populating correctly. different values for opus?
// Make sure delete/add/update piece works in redux store
// Now style the manage holdings page

// Edit acquisition date?

// Make sure general search works*** memoized selector

// css file

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page

// Fix buttons and bootstrap default colors

// Alerts on success for cataloguing, logging in, etc. What happens if login fails?

// Renew authToken logic

export default Home;
