import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {
  FaStar, 
  FaUsers, 
  FaHeartbeat, 
  FaShieldAlt,
} from "react-icons/fa";

import "../../styles/about/about.css";

export default function AboutValues() {
  return (
    <>
      <Container className="my-5">
        <Row className="g-4">
          <Col md={3}>
            <Card className="text-center shadow border-0 p-4">
              <FaStar
                size={50}
                className="mx-auto"
                style={{ color: "#660ff1" }}
              />
              <h5 className="mt-3 fw-bold">Expert Care</h5>
              <p className="text-muted">Licensed professional therapists.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow border-0 p-4">
              <FaUsers
                size={50}
                className="mx-auto"
                style={{ color: "#660ff1" }}
              />
              <h5 className="mt-3 fw-bold">Supportive Community</h5>
              <p className="text-muted">Connect with understanding peers.</p>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="text-center shadow border-0 p-4">
              <FaHeartbeat
                size={50}
                className="mx-auto"
                style={{ color: "#660ff1" }}
              />
              <h5 className="mt-3 fw-bold">Personalized Care</h5>
              <p className="text-muted">Tailored to your unique needs.</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow border-0 p-4">
              <FaShieldAlt
                size={50}
                className="mx-auto"
                style={{ color: "#660ff1" }}
              />
              <h5 className="mt-3 fw-bold">Confidential Support</h5>
              <p className="text-muted">Private and secure sessions.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
