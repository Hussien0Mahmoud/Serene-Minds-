import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedDate === 'all' 
    ? events 
    : events.filter(event => event.date === selectedDate);

  const uniqueDates = ['all', ...new Set(events.map(event => event.date))];

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upcoming Events</h2>
        <Form.Select 
          style={{ width: 'auto' }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="all">All Dates</option>
          {uniqueDates.filter(date => date !== 'all').map((date, index) => (
            <option key={index} value={date}>{date}</option>
          ))}
        </Form.Select>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row className="g-4">
          {filteredEvents.map((event) => (
            <Col md={6} key={event.id}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                {event.image && (
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={event.image}
                      alt={event.title}
                      style={{ 
                        height: '200px', 
                        objectFit: 'cover',
                        borderTopLeftRadius: 'calc(0.375rem - 1px)',
                        borderTopRightRadius: 'calc(0.375rem - 1px)'
                      }}
                    />
                    <div 
                      className="position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 1 }}
                    >
                      <Badge 
                        bg="primary" 
                        style={{ backgroundColor: '#660ff1' }}
                      >
                        ${event.price}
                      </Badge>
                    </div>
                  </div>
                )}
                <Card.Body>
                  <Badge 
                    bg="primary" 
                    className="mb-3"
                    style={{ backgroundColor: '#660ff1' }}
                  >
                    {event.category}
                  </Badge>
                  <h3 className="h4 mb-3">{event.title}</h3>
                  <p className="text-muted mb-4">{event.description}</p>
                  
                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendar className="text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaClock className="text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaUsers className="text-primary" />
                      <span>{event.spotsLeft} spots left</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <small className="text-muted">
                      Presented by: {event.presenter}
                    </small>
                    <Button 
                      variant="primary" 
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