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

  // Create the PDF manual

// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// How to use this application page

// Mess with electron/getting/setting digital catalogue path <-- start here
// Option to not set basePath and use without digital catalogue

// Remove mysql backup
// Need to set digital catalogue path in Redux at App.js, not manually. Remove from settings page

// Make sure the relative path is stored and it works no matter where the base path is! Try to make a copy of the root folder and rename it

// Add PDF "upload" to digital catalogue
// Add setup wizard
    // Register as an admin, if applicable
    // Blurb explaining base folder, then button "scan for folder" and show check mark or x and option to point somewhere else
    // On future opens, look for digital catalogue and warn if it has moved
    // See chatgpt


// Getting cancelled login flag on login...check

// Demo call numbers

// How to handle MySQL... bundle with app, docker, etc.?

/* Testing:

1. Have someone else log in and try to do admin things
2. Try all forms
3. Try all backups
4. All token renewal things
5. All things involving base path; Check that things happen ONLY if base path is set--navigating to digital scans, etc.
6. What if no call number is present?
7. Test on different devices

*/

/* Long-term goals:

1. Add optional cloud integration for digital catalogue (BackBlaze)
2. Add metadata for advanced filtering in digital catalogue

*/

export default Home;
