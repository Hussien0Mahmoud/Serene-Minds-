import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaVideo, FaBookOpen, FaUserMd } from 'react-icons/fa';

export default function UserDashboard() {
  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Next Appointment</h5>
                <Button variant="primary" size="sm">View All</Button>
              </div>
              
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#660ff115'
                  }}
                >
                  <FaCalendarAlt size={24} style={{ color: '#660ff1' }} />
                </div>
                <div>
                  <h6 className="mb-1">Session with Dr. Sarah Williams</h6>
                  <p className="mb-0 text-muted">Today at 2:00 PM</p>
                </div>
                <Button 
                  variant="outline-primary" 
                  className="ms-auto"
                  style={{ borderColor: '#660ff1', color: '#660ff1' }}
                >
                  <FaVideo className="me-2" />
                  Join Session
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Recent Resources</h5>
              <Row className="g-3">
                {['Stress Management Guide', 'Meditation Basics', 'Sleep Improvement Tips'].map((resource, index) => (
                  <Col md={4} key={index}>
                    <Card className="h-100">
                      <Card.Body>
                        <FaBookOpen className="mb-3" size={24} style={{ color: '#660ff1' }} />
                        <h6>{resource}</h6>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Your Therapist</h5>
              <div className="text-center">
                <div className="mb-3">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="Therapist"
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px' }}
                  />
                </div>
                <h6>Dr. Sarah Williams</h6>
                <p className="text-muted small mb-3">Clinical Psychologist</p>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  style={{ borderColor: '#660ff1', color: '#660ff1' }}
                >
                  Send Message
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}