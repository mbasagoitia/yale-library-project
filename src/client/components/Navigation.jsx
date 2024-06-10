import React from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Navigation = () => {
  return (
        <Navbar expand="lg" bg="light" variant="light" className="site-nav">
            <div className="nav-content">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto d-flex justify-content-between align-items-center w-100">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/">Browse Collection</Nav.Link>
                    <NavDropdown title="Reports" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/">Missing Parts</NavDropdown.Item>
                        <NavDropdown.Item href="/">Poor Condition</NavDropdown.Item>
                        <NavDropdown.Item href="/">Custom Report</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/">Digital Catalogue</Nav.Link>
                    <Nav.Link href="/">Classification Guide</Nav.Link>
                    <NavDropdown title="Librarian" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/">Log In</NavDropdown.Item>
                        <NavDropdown.Item href="/">Log Out</NavDropdown.Item>
                        <NavDropdown.Item href="/manage-holdings">Manage Holdings</NavDropdown.Item>
                        <NavDropdown.Item href="/">Manage Users</NavDropdown.Item>
                        <NavDropdown.Item href="/">Settings</NavDropdown.Item>
                    </NavDropdown>
                    <Form>
                        <div className="search-wrapper">
                            <FormControl type="text" placeholder="Search our collection" className="mr-sm-2 rounded-pill" />
                            <Button type="submit" variant="rounded-pill search-button">
                                <i className="fa fa-search"></i>
                            </Button>
                        </div>
                    </Form>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
  );
}

export default Navigation;
