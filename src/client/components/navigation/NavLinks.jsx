import { Nav } from 'react-bootstrap';

const NavLinks = ({ setNavExpanded, isLoggedIn, isAdmin }) => {
  return (
    <>
      <Nav.Link href="/" onClick={() => setNavExpanded(false)}>Home</Nav.Link>
      <Nav.Link href="/browse-holdings" onClick={() => setNavExpanded(false)}>Browse Collection</Nav.Link>
      <Nav.Link href="/digital-catalogue" onClick={() => setNavExpanded(false)}>Digital Catalogue</Nav.Link>
      <Nav.Link href="/classification-guide" onClick={() => setNavExpanded(false)}>Classification Guide</Nav.Link>

      {isLoggedIn && isAdmin ? (
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
    </>
  );
};

export default NavLinks;
