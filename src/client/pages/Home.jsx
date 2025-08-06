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


// Edit acquisition date?

// css file

// Fix stuff on CatalogueNew page (leftover attempts to clear form), rename
// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page
// Style reports select

// Renew authToken logic

// Alerts on no permission
// Remove console.errors and consider error handling

export default Home;
