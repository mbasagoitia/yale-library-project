import HomeCards from '../components/general/HomeCards';
import "../../assets/styles/pages/HomePage.css";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="homepage-bg">
      <motion.div
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="home-content">
          <motion.h1
            className="text-center text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Yale Philharmonia Library Catalogue
          </motion.h1>
          <div className="mt-8">
            <HomeCards />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

// Revisit font sizes in demo and internal
// Acquisition date and DLP on Don Giovanni and La Mer is weird, fix
// Genre dropdown not opening all the way initially?
// Make sure navigation from single piece to digital catalogue works on internal
// Users should not be able to change digital catalogue base path in demo mode (make sure backend and front end are protected)
// Test add new admin on internal
// Export as csv doesn't work on demo (not logged in error)
// Add location.back button from digital catalogue but only if user navigate there from piece info page

// Update all acquisition dates (anything added within past year...) for real data

// Keytar with .env

/* Testing:

1. Make sure flow with Setup wizard/missing path notice works correctly on internal and demo
1. Have someone else log in and try to do admin things (just remove yourself as admin)
2. Try all forms
3. Try all backups
4. All token renewal things
5. All things involving base path; Check that things happen ONLY if base path is set--navigating to digital scans, etc.
7. Test on different devices
8. Make sure the relative path is stored and it works no matter where the base path is! Try to make a copy of the root folder and rename it

*/

/* Long-term goals:

1. Add optional cloud integration for digital catalogue (BackBlaze)
2. Add metadata for advanced filtering in digital catalogue

*/

