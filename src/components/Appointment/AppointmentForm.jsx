import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    therapist: '',
    sessionType: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add appointment booking logic here
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ background: '#f8f9fa', padding: '80px 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4">Book Your Appointment</h2>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <div className="position-relative">
                          <FaUser className="position-absolute" style={{ top: '12px', left: '15px', color: '#660ff1' }} />
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className="ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <div className="position-relative">
                          <FaEnvelope className="position-absolute" style={{ top: '12px', left: '15px', color: '#660ff1' }} />
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <div className="position-relative">
                          <FaPhone className="position-absolute" style={{ top: '12px', left: '15px', color: '#660ff1' }} />
                          <Form.Control
                            type="tel"
                            name="phone"
                            placeholder="Enter your phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Therapist</Form.Label>
                        <Form.Select
                          name="therapist"
                          value={formData.therapist}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose a therapist</option>
                          <option value="dr-sarah">Dr. Sarah Williams</option>
                          <option value="dr-michael">Dr. Michael Chen</option>
                          <option value="dr-emily">Dr. Emily Rodriguez</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Date</Form.Label>
                        <div className="position-relative">
                          <FaCalendarAlt className="position-absolute" style={{ top: '12px', left: '15px', color: '#660ff1' }} />
                          <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Preferred Time</Form.Label>
                        <div className="position-relative">
                          <FaClock className="position-absolute" style={{ top: '12px', left: '15px', color: '#660ff1' }} />
                          <Form.Control
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Session Type</Form.Label>
                    <Form.Select
                      name="sessionType"
                      value={formData.sessionType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select session type</option>
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="chat">Chat Session</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Additional Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any specific concerns or questions?"
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 py-3"
                    style={{ backgroundColor: '#660ff1', border: 'none' }}
                  >
                    Schedule Appointment
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}