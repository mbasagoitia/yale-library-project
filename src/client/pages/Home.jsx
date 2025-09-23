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
            className="text-center text-3xl font-bold mb-5"
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

// Update all acquisition dates (anything added within past year...) for real data
// Write README

// Keytar with .env

/* Testing:

// In demo, moved base path does not throw any errors, just doesn't display digital catalogue

1. Protect setting base path on backend if in demo mode?

7. Test on different devices

Issue when cancelling login window?
// Show modal instead of alert when giving "you're not an admin" warning in App.js <---- START HERE
// Put admins back in the VM database

*/

/* Long-term goals:

1. Add optional cloud integration for digital catalogue (BackBlaze)
2. Add metadata for advanced filtering in digital catalogue

*/

