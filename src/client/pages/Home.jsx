import HomeCards from '../components/general/HomeCards';
import "../../assets/styles/pages/HomePage.css";

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


// Something more enticing for home page? Photos of Woolsey, rehearsals? Fade in?
// Scans will need to link to local path, not Google Drive. Check if base folder is set before allowing you to click it.
// How to use this application page


// How to handle MySQL... bundle with app, docker, etc.?

/* Testing:

1. Have someone else log in and try to do admin things
2. Try all forms
3. Try all backups
4. All token renewal things
5. What if no call number is present?
6. Test on different devices

*/

export default Home;
