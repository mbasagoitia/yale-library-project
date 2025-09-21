import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { login } from "../../../redux/authSlice";
import { Navbar, Nav } from 'react-bootstrap';
import Searchbar from '../search-filters/Searchbar';
import { generalSearch } from "../../../redux/searchSlice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../../../assets/styles/components/Navbar.css";
import cfg from "../../../config/appConfig";
import NavLinks from './NavLinks';
import UserMenu from './UserMenu';

const Navigation = () => {
  
  const isDemo = cfg.isDemo;

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
      import('../../helpers/auth/handleAuth').then(({ openLoginWindow }) => openLoginWindow());
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
            <NavLinks setNavExpanded={setNavExpanded} isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
            <div className="nav-searchbar my-2">
              <Searchbar placeholder={"Search the collection"} onSearch={handleSearch} />
            </div>
            <UserMenu
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              setNavExpanded={setNavExpanded}
              handleLogin={handleLogin}
            />
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Navigation;
