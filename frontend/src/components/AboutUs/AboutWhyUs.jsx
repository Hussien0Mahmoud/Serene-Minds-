import { Container, Row, Col, Card } from "react-bootstrap";

import '../../styles/about/about.css';

export default function AboutWhyUs() {
  return (
    <>
        <Container className="my-5 text-center">
          <h2 className="fw-bold " style={{ color: '#660ff1' }}>Why Choose Us?</h2>
          <p className="text-muted">Your trusted partner in mental wellness</p>
          <Row className="g-4">
            <Col md={4}>
              <Card className="shadow border-0 p-4">
                <h5 className="fw-bold">Easy Access</h5>
                <p className="text-muted">Connect from any device, anywhere.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow border-0 p-4">
                <h5 className="fw-bold">Professional Care</h5>
                <p className="text-muted">Licensed and experienced therapists.</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow border-0 p-4">
                <h5 className="fw-bold">5000+ Supported Lives</h5>
                <p className="text-muted">Trusted by clients worldwide.</p>
              </Card>
            </Col>
          </Row>
        </Container>
    </>
  )
}
