import { useState, useEffect } from "react";
import AuthButton from "../components/AuthButton";
import { CgHello } from "react-icons/cg";

const Home = () => {

    // Move this logic to App eventually

    const [admin, setAdmin] = useState(false);
    const [netidval, setNetidVal] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        window.electron?.ipcRenderer?.on('auth-success', (event, data) => {
          const { netid, isAdmin } = data;
          console.log(data)
          setNetidVal(netid)
          setAdmin(isAdmin)
          setLoggedIn(true)
        });
      }, []);
      
    return (
        <div className="home">
            <div>
            {(!loggedIn? <AuthButton />: `Hello, ${netidval}. You are ${admin ? "" : "not"} an admin.`)}
            </div>
        </div>
    );
};

// Call number needs to be correctly reflected on submit even if the user doesn't generate it
// Add field to update acquisition date
// Fix buttons and bootstrap default colors
// Pagination for holdings page
// Make the search bar and filters functional

// What kinds of reports to generate?

export default Home;
