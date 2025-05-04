import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events/');
      setEvents(response.data.results || [response.data]); // Handle both array and single object
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Upcoming Events</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row className="g-4">
          {events.map((event) => (
            <Col key={event.id} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                {event.image && (
                  <Card.Img 
                    variant="top" 
                    src={event.image}
                    alt={event.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge bg="primary" style={{ backgroundColor: '#660ff1' }}>
                      {event.category}
                    </Badge>
                    <h5 className="text-primary mb-0">${event.price}</h5>
                  </div>
                  
                  <h4 className="mb-3">{event.title}</h4>
                  <p className="text-muted mb-4">{event.description}</p>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendar style={{ color: '#660ff1' }} />
                      <span>{event.date}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaClock style={{ color: '#660ff1' }} />
                      <span>{event.time}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaMapMarkerAlt style={{ color: '#660ff1' }} />
                      <span>{event.location}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaUsers style={{ color: '#660ff1' }} />
                      <span>{event.spots_left} spots left</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">
                      Presented by: {event.presenter}
                    </small>
                    <Button 
                      variant="primary"
                      size="sm"
                      style={{ backgroundColor: '#660ff1', border: 'none' }}
                    >
                      Register Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}