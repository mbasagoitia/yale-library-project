import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Searchbar from '../search-filters/Searchbar';
import { openLoginWindow, handleLogout } from '../../helpers/auth/handleAuth';

const Navigation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Navbar
      expand="lg"
      bg="light"
      variant="light"
      className={`site-nav ${isHovered ? "hovered" : ""}`}
    >
      <div className="nav-content">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto d-flex justify-content-between align-items-center w-100">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/browse-holdings">Browse Collection</Nav.Link>
            <Nav.Link href="digital-catalogue">Digital Catalogue</Nav.Link>
            <Nav.Link href="/classification-guide">Classification Guide</Nav.Link>
            <Nav.Link href="/reports">Reports</Nav.Link>

            {isAdmin ? (
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <NavDropdown
                  title="Librarian"
                  id="basic-nav-dropdown"
                  show={isHovered}
                >
                  <NavDropdown.Item href="/manage-holdings">Manage Holdings</NavDropdown.Item>
                  <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                  <Dropdown.Divider />
                  <NavDropdown.Item as="span" className="logout-text" onClick={() => handleLogout(dispatch)}>Log Out</NavDropdown.Item>
                </NavDropdown>
              </div>
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