import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../../../redux/authSlice";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Searchbar from '../search-filters/Searchbar';
import { generalSearch } from "../../../redux/searchSlice";
import { openLoginWindow, handleLogout } from '../../helpers/auth/handleAuth';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle} from 'react-icons/fa';
import { toast } from 'react-toastify';
import "../../../assets/styles/components/Navbar.css";

const Navigation = () => {
  const isDemo = process.env.REACT_APP_APP_MODE === 'demo' || process.env.REACT_APP_CAS_ENABLED === 'false';

  const [isHovered, setIsHovered] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (isDemo) {
      dispatch(login({ netid: 'demo', isAdmin: true }));
      toast.success(`Welcome back, demo user!`);
    } else {
      openLoginWindow();
    }
  }

  const handleNavLogout = async () => {
    try {
      await handleLogout(dispatch, navigate);
      toast.success('Logged out');
      setIsHovered(false);
      setNavExpanded(false);
    } catch (error) {
      toast.error(`Error logging out: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSearch = (searchText) => {
    dispatch(generalSearch({ query: searchText }));
    setNavExpanded(false);
    navigate("/browse-holdings");
  };

  return (
    <Navbar
      expand="lg"
      bg="light"
      variant="light"
      expanded={navExpanded}
      onToggle={(expanded) => setNavExpanded(expanded)}
      className={`site-nav ${isHovered ? "hovered" : ""}`}
    >
      <div className="nav-content">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto d-flex justify-content-evenly align-items-center w-100">
            <Nav.Link href="/" onClick={() => setNavExpanded(false)}>Home</Nav.Link>
            <Nav.Link href="/browse-holdings" onClick={() => setNavExpanded(false)}>Browse Collection</Nav.Link>
            <Nav.Link href="/digital-catalogue" onClick={() => setNavExpanded(false)}>Digital Catalogue</Nav.Link>
            <Nav.Link href="/classification-guide" onClick={() => setNavExpanded(false)}>Classification Guide</Nav.Link>

            {isLoggedIn ? (
              <Nav.Link href="/reports" onClick={() => setNavExpanded(false)}>Reports</Nav.Link>
            ) : (
              <Nav.Link
                as="span"
                disabled
                style={{ pointerEvents: "none", opacity: 0.5 }}
              >
                Reports
              </Nav.Link>
            )}

            <div className="nav-searchbar my-2">
              <Searchbar placeholder={"Search the collection"} onSearch={handleSearch} />
            </div>

            {isAdmin ? (
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <NavDropdown
                  title={<><FaUserCircle size={24} /><span className="mx-2">Librarian</span></>}
                  id="basic-nav-dropdown"
                  show={isHovered}
                  className="nav-nav-dropdown"
                >
                  <NavDropdown.Item href="/manage-holdings" onClick={() => setNavExpanded(false)}>Manage Holdings</NavDropdown.Item>
                  <NavDropdown.Item href="/settings" onClick={() => setNavExpanded(false)}>Settings</NavDropdown.Item>
                  <Dropdown.Divider />
                  <NavDropdown.Item
                    as="span"
                    className="logout-text"
                    onClick={handleNavLogout}
                  >
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <Nav.Link as="span" onClick={handleLogin}><FaUserCircle size={24} /><span className="mx-2">Log In</span></Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
