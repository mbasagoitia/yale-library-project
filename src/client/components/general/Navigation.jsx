import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Searchbar from '../search-filters/Searchbar';
import { openLoginWindow, handleLogout } from '../../helpers/auth/handleAuth';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavLogout = async () => {
    setIsHovered(false);
    setNavExpanded(false);
    await handleLogout(dispatch, navigate);
  };

  const handleSearch = {
    // set global search state
    // navigate to browse page
  }

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
          <Nav className="mr-auto d-flex justify-content-between align-items-center w-100">
            <Nav.Link href="/" onClick={() => setNavExpanded(false)}>Home</Nav.Link>
            <Nav.Link href="/browse-holdings" onClick={() => setNavExpanded(false)}>Browse Collection</Nav.Link>
            <Nav.Link href="digital-catalogue" onClick={() => setNavExpanded(false)}>Digital Catalogue</Nav.Link>
            <Nav.Link href="/classification-guide" onClick={() => setNavExpanded(false)}>Classification Guide</Nav.Link>

            {isAdmin ? (
              <>
              <Nav.Link href="/reports" onClick={() => setNavExpanded(false)}>Reports</Nav.Link>
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <NavDropdown
                  title="Librarian"
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
              </>
            ) : (
              <Nav.Link as="span" onClick={() => openLoginWindow()}>Log In</Nav.Link>
            )}

            <div className="nav-searchbar">
              <Searchbar placeholder={"Search the collection"} />
            </div>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;