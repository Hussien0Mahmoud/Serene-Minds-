import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import '../../styles/about/about.css';

export default function AboutHero() {
  return (
    <>
        <div className="hero-section text-white text-center d-flex flex-column justify-content-center align-items-center py-5">
            <Container>
                <h1 className="display-3 fw-bold" style={{ color: '#660ff1' }}>Our Mission</h1>
                <p className="lead mt-3 fs-4" style={{ color: '#660ff1' }}>
                    Dedicated to Supporting Your Mental Health Journey with Professional Care
                </p>
                <Link 
                    className="btn btn-lg mt-3" 
                    to={'/'} 
                    style={{ outline: '1px solid #660ff1' }}
                >
                    Return Home
                </Link>
            </Container>
        </div>
    </>
  )
}
