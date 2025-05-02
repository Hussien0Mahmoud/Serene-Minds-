import { Container, Row, Col, Card } from "react-bootstrap";
import { 
  FaHeart,
  FaHandHoldingHeart,
  FaHeadset,
  FaUserShield
} from "react-icons/fa";

import '../../styles/about/about.css';

export default function AboutFeatures() {
  return (
    <>
        <Container className="my-5 bg-body-tertiary">
          <Row className="align-items-center">
            {/* Left Image */}
            <Col md={6} className="text-center mb-4 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21"
                alt="Supportive Online Therapy Environment"
                style={{ height: "450px", width: "100%", objectFit: "cover" }}
                className="img-fluid rounded"
              />
            </Col>
    
            {/* Right Features */}
            <Col md={6}>
              <h5 className="fw-bold fs-3 alert" style={{ color: '#660ff1' }}>Why Choose Us</h5>
              <h2 className="fw-bold text-black-50">
                Empowering Your Mental Health Journey
              </h2>
              <p className="text-muted">
                We believe in making professional mental health support accessible to everyone. 
                Our platform connects you with experienced therapists in a secure, confidential 
                environment where you can feel safe and understood.
              </p>
    
              <Row>
                <Col xs={6} className="mb-3">
                  <Card className="p-3 border-0 shadow-sm text-center align-items-center">
                    <FaHeart size={30} style={{ color: '#4CAF50' }} />
                    <h6 className="mt-2 fw-bold">Empathetic Support</h6>
                  </Card>
                </Col>
                <Col xs={6} className="mb-3">
                  <Card className="p-3 border-0 shadow-sm text-center align-items-center">
                    <FaHandHoldingHeart size={30} style={{ color: '#FF5722' }} />
                    <h6 className="mt-2 fw-bold">Tailored Therapy</h6>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="p-3 border-0 shadow-sm text-center align-items-center">
                    <FaHeadset size={30} style={{ color: '#2196F3' }} />
                    <h6 className="mt-2 fw-bold">Always Available</h6>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="p-3 border-0 shadow-sm text-center align-items-center">
                    <FaUserShield size={30} style={{ color: '#660ff1' }} />
                    <h6 className="mt-2 fw-bold">Secure Sessions</h6>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
    </>
  )
}
