import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navigation() {
  return (
    <Navbar className="navbar navCustom shadow-lg" bg="dark" expand="lg">
      <Navbar.Brand className="text-white me-5">Insert web Name</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <Nav.Link href="/" className="text-white">
            Home
          </Nav.Link>
          <Nav.Link href="/login" className="text-white">
            Login
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
