import {
  Card,
  Container,
  Jumbotron,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";

const Footer = () => {
  return (
    <Navbar bg="light" sticky="bottom">
      {" "}
      <Nav className="ml-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#about">About</Nav.Link>
        <Nav.Link href="#contact">Contact Us</Nav.Link>
        <Nav.Link href="https://www.twitter.com/petscorts/" target="_blank">
          {" "}
          <i class="fa fa-twitter" aria-hidden="true"></i>
        </Nav.Link>
        <Nav.Link href="https://www.instagram.com/petscorts/" target="_blank">
          {" "}
          <i class="fa fa-instagram" aria-hidden="true"></i>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Footer;
