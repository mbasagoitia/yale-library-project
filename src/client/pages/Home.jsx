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