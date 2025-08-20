import HomeCards from '../components/general/HomeCards';
import "../../assets/styles/pages/HomePage.css";

const Home = () => {
      
    return (
        <div className="home">
            <h1 className="text-center">Yale Philharmonia Library Catalogue</h1>
            <div className="mt-4">
                <HomeCards />
            </div>
        </div>
    );
};


// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// How to use this application page

// Check that things happen ONLY if base path is set--navigating to digital scans, etc.
// Style InfoTable digital scans text so you know you can click it


// Getting cancelled login flag on login...check

// Demo call numbers

// How to handle MySQL... bundle with app, docker, etc.?

/* Testing:

1. Have someone else log in and try to do admin things
2. Try all forms
3. Try all backups
4. All token renewal things
5. What if no call number is present?
6. Test on different devices

*/

/* Long-term goals:

1. Add optional cloud integration for digital catalogue (BackBlaze)
2. Add metadata for advanced filtering in digital catalogue

*/

export default Home;
