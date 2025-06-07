import { useSelector } from 'react-redux';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Searchbar from './Searchbar';
import { openLoginWindow, handleLogout } from '../helpers/handleAuth';
import { useDispatch } from 'react-redux';

const Navigation = () => {

  const { netid, isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();

  return (
        <Navbar expand="lg" bg="light" variant="light" className="site-nav">
            <div className="nav-content">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto d-flex justify-content-between align-items-center w-100">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/browse-holdings">Browse Collection</Nav.Link>
                    <NavDropdown title="Reports" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/">Missing Parts</NavDropdown.Item>
                        <NavDropdown.Item href="/">Poor Condition</NavDropdown.Item>
                        <NavDropdown.Item href="/">Custom Report</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/">Digital Catalogue</Nav.Link>
                    <Nav.Link href="/classification-guide">Classification Guide</Nav.Link>
                    {isAdmin ? (
                    <NavDropdown title="Librarian" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/" onClick={() => handleLogout(dispatch)}>Log Out</NavDropdown.Item>
                        <NavDropdown.Item href="/manage-holdings">Manage Holdings</NavDropdown.Item>
                        <NavDropdown.Item href="/">Manage Users</NavDropdown.Item>
                        <NavDropdown.Item href="/">Settings</NavDropdown.Item>
                    </NavDropdown>
                    ) : 
                    <Nav.Link href="/" onClick={() => openLoginWindow}>Log In</Nav.Link>}
                    <div>
                        <Searchbar placeholder={"Search the collection"} />
                    </div>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
  );
}

export default Navigation;
