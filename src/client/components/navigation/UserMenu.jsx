import { NavDropdown, Nav } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../helpers/auth/handleAuth';

const UserMenu = ({ isLoggedIn, isAdmin, isHovered, setIsHovered, setNavExpanded, handleLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  if (isLoggedIn && isAdmin) {
    return (
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
    );
  } else {
    return (
      <Nav.Link as="span" onClick={handleLogin}>
        <FaUserCircle size={24} /><span className="mx-2">Log In</span>
      </Nav.Link>
    );
  }
};

export default UserMenu;
