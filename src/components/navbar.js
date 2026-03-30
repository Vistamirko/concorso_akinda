import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function BasicExample() {
  return (
    <Navbar expand="lg" className="bg-white">
      <Container>
      <Navbar.Brand href="/">
            <img
              src="./logo.svg"
              width="60"
              height="64"
              className="d-inline-block align-top"
              alt="PennyItalia"
            />
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/fb-comment">Fb.Commenti</Nav.Link>
            <Nav.Link href="#fb-hashtag">Fb. Hashtag</Nav.Link>
            <Nav.Link href="#fb-instagram">Fb. Instagram</Nav.Link>
            <Nav.Link href="#fb-instagram">Fb. Instagram</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;