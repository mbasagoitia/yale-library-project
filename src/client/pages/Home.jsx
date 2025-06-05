import { useState, useEffect } from "react";
import AuthButton from "../components/AuthButton";

const Home = () => {

    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        window.electron?.ipcRenderer?.on('auth-success', (event, data) => {
          const { netid, isAdmin } = data;
          setAdmin(isAdmin)
        });
      }, []);
      
    return (
        <div className="home">
            {admin ? <div>Hello, Admin</div> : <AuthButton />}
        </div>
    );
};

// Call number needs to be correctly reflected on submit even if the user doesn't generate it
// Add field to update acquisition date
// Fix buttons and bootstrap default colors
// Pagination for holdings page
// Make the search bar and filters functional

// Ask about what kinds of reports to generate (automatically based on date?)

export default Home;
