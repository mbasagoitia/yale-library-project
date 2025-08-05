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

// Is the form actually being reset when cataloguing new piece?

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page

// Fix buttons and bootstrap default colors

// Redux needs to reload the holdings if something has been added/updated/deleted
// Multiple login banners are showing
// Reset medium???

// Renew authToken logic

// Remove console.errors and consider error handling

export default Home;
