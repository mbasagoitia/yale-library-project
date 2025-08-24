import HomeCards from '../components/general/HomeCards';
import "../../assets/styles/pages/HomePage.css";

const Home = () => {
      
    return (
        <div className="homepage-bg">
            <div className="home">
                <div className="home-content">
                    <h1 className="text-center">Yale Philharmonia Library Catalogue</h1>
                    <div className="mt-4">
                        <HomeCards />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Create the PDF manual
// Don't let setup wizard/warning close until base path is set  
// Is the check catalogue folder actually working right?

// Home page fade in?
// Clear advanced search not working, start on AdvancedFilter component <-- start here

// Make sure the relative path is stored and it works no matter where the base path is! Try to make a copy of the root folder and rename it

// Add PDF "upload" to digital catalogue

// Getting cancelled login flag on login...check

// Demo call numbers

// How to handle MySQL... bundle with app, docker, etc.?

// Consider all demo vs internal functions

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
