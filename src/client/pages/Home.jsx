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
// Renew authToken logic

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page
// Style reports select

// css file

// Alerts on no permission
// Remove console.errors and consider error handling
// Middleware error handler

export default Home;
