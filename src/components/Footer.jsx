import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Mental Health Support</h5>
            <p className="mb-4">
              Dedicated to providing professional mental health support and resources.
              Your journey to better mental health starts here.
            </p>
            <div className="d-flex gap-3 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white fs-5">
                <FaLinkedin />
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Quick Links</h5>
            <ListGroup variant="flush" className="footer-links">
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/about" className="text-white text-decoration-none">About Us</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/contact" className="text-white text-decoration-none">Contact Us</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/resources" className="text-white text-decoration-none">Resources</Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Services</h5>
            <ListGroup variant="flush" className="footer-links">
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/appointment" className="text-white text-decoration-none">Book Appointment</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/events" className="text-white text-decoration-none">Events & Workshops</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/therapists" className="text-white text-decoration-none">Our Therapists</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/support" className="text-white text-decoration-none">Support Groups</Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <h5 className="text-uppercase mb-4">Stay Connected</h5>
            <p className="mb-3">
              Subscribe to receive mental health tips, event updates, and resources.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
                aria-label="Your email"
              />
              <button 
                className="btn" 
                type="button"
                style={{ backgroundColor: '#660ff1', color: 'white' }}
              >
                Subscribe
              </button>
            </div>
            <p className="small text-muted">
              Your mental health journey matters to us. We respect your privacy.
            </p>
          </Col>
        </Row>

        <hr className="my-4" />

      </Container>
    </footer>
  );
};

export default Footer;
