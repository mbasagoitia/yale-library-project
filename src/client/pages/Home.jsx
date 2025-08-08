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

// Renew authToken logic (make sure it works)

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Style reports and single piece page
// Style reports select

// css file

// Sanitize inputs

/* Testing:

1. Have someone else log in and try to do admin things
2. Try all forms
3. Try all backups
4. All token renewal things
5. Test on different devices

*/

export default Home;
