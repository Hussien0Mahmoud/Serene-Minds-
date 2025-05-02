import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import '../../styles/about/about.css';

export default function AboutReadyToBuild() {
  return (
    <>
        <Container className="text-center my-5">
          <h3 className="fw-bold">Ready to Start Your Healing Journey?</h3>
          <p className="text-muted">Connect with our licensed therapists and begin your path to wellness today.</p>
          <Link to="/services" className="btn btn-lg" style={{ backgroundColor: '#660ff1', border: 'none', color:'white' }}>
            Explore Services
          </Link>
        </Container>
    </>
  )
}
