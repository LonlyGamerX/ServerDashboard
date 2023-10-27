import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Cookies from "js-cookie";

function AdminNavigation() {
  const name = Cookies.get("name");

  return (
    <Navbar className="navbar navCustom shadow-lg" bg="dark" expand="lg">
      <Navbar.Brand className="text-white me-5">{name}</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav>
          <Nav.Link href="/" className="text-white">
            Home
          </Nav.Link>
          <Nav.Link href="/admin/dashboard" className="text-white">
            dashboard
          </Nav.Link>
          <Nav.Link href="/logout" className="text-white ms-auto">
            Logout
          </Nav.Link>  
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AdminNavigation;
