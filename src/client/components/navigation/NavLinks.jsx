import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavLinks = ({ setNavExpanded, isLoggedIn, isAdmin }) => {
  return (
    <>
      <Nav.Link
        as={Link}
        to="/"
        onClick={() => setNavExpanded(false)}
      >
        Home
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/browse-holdings"
        onClick={() => setNavExpanded(false)}
      >
        Browse Collection
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/digital-catalogue"
        onClick={() => setNavExpanded(false)}
      >
        Digital Catalogue
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/classification-guide"
        onClick={() => setNavExpanded(false)}
      >
        Classification Guide
      </Nav.Link>

      {isLoggedIn && isAdmin ? (
        <Nav.Link
          as={Link}
          to="/reports"
          onClick={() => setNavExpanded(false)}
        >
          Reports
        </Nav.Link>
      ) : (
        <Nav.Link
          as="span"
          disabled
          style={{ pointerEvents: "none", opacity: 0.5 }}
        >
          Reports
        </Nav.Link>
      )}
    </>
  );
};

export default NavLinks;
