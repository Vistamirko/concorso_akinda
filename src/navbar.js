import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function BasicExample() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate("/login");
  };

  if (!isAuthenticated) return null; // Don't show navbar on login page if preferred, or just hide links

  return (
    <Navbar expand="lg" variant="dark" className="navbar">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center gap-3">
          <img
            src="/scraper_logo.png"
            height="50"
            style={{ width: 'auto', borderRadius: '8px', filter: 'drop-shadow(0 0 8px rgba(0, 132, 255, 0.3))' }}
            alt="SCRAPER.HUB Logo"
          />
          <span className="h4 mb-0 fw-800 tracking-tighter text-white">SCRAPER<span className="opacity-80">.HUB</span></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link href="/">Dashboard</Nav.Link>
            
            <NavDropdown title="Eurobet" id="eurobet-nav-dropdown" className="mx-lg-2">
              <div className="dropdown-label-custom small opacity-50 px-3 py-1">CONCORSI</div>
              <NavDropdown.Item href="/eurobet-wave1">Instagram Commenti (W1)</NavDropdown.Item>
              <NavDropdown.Item href="/eurobet-instagram">Instagram Hashtag (W4)</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Penny" id="penny-nav-dropdown" className="mx-lg-2">
              <div className="dropdown-label-custom small opacity-50 px-3 py-1">ESTRAZIONE WAVE 2 (PULITI)</div>
              <NavDropdown.Item href="/penny-wave2-facebook">Facebook Commenti (Validi)</NavDropdown.Item>
              <NavDropdown.Item href="/penny-wave2-instagram">Instagram Commenti (Validi)</NavDropdown.Item>
              <NavDropdown.Divider />
              <div className="dropdown-label-custom small opacity-50 px-3 py-1">RAW DATA (NON PULITI)</div>
              <NavDropdown.Item href="/penny-wave2-raw-facebook">FB Raw Data (Tutti i commenti)</NavDropdown.Item>
              <NavDropdown.Item href="/penny-wave2-raw-instagram">IG Raw Data (Tutti i commenti)</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Archivio" id="archive-nav-dropdown" className="ms-lg-4">
              <NavDropdown.Item href="/IgPost">Post Instagram</NavDropdown.Item>
              <NavDropdown.Item href="/FbPost">Post Facebook</NavDropdown.Item>
              <NavDropdown.Item href="/IgComment">Commenti Instagram</NavDropdown.Item>
            </NavDropdown>

            <Button 
              variant="outline-light" 
              size="sm" 
              className="ms-lg-4 mt-3 mt-lg-0 opacity-75 logout-btn"
              onClick={handleLogout}
              style={{ borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}
            >
              LOGOUT
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;