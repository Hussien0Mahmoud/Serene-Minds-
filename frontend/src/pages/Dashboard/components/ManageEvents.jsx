import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

export default function ManageEvents() {
  const [events, setEvents] = useState({
    items: [],
    count: 0,
    next: null,
    previous: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/events/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setEvents({
        items: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      });
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const eventData = {
        title: selectedEvent.title,
        date: selectedEvent.date,
        time: selectedEvent.time,
        location: selectedEvent.location,
        category: selectedEvent.category,
        capacity: parseInt(selectedEvent.capacity),
        description: selectedEvent.description,
        presenter: selectedEvent.presenter,
        price: parseFloat(selectedEvent.price),
        image: selectedEvent.image
      };

      if (selectedEvent.id) {
        await axios.patch(`http://localhost:8000/api/events/${selectedEvent.id}/`, eventData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://localhost:8000/api/events/', eventData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      setShowModal(false);
      await fetchEvents();
      alert(selectedEvent.id ? 'Event updated successfully!' : 'Event added successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.response?.data?.detail || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/events/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Manage Events</h4>
          <Button 
            onClick={() => {
              setSelectedEvent({
                title: '',
                date: '',
                time: '',
                location: '',
                category: '',
                capacity: 0,
                description: '',
                presenter: '',
                price: 0,
                image: ''
              });
              setShowModal(true);
            }}
            style={{ backgroundColor: '#660ff1', border: 'none' }}
          >
            Add New Event
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.items.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="rounded me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div className="fw-bold">{event.title}</div>
                          <Badge bg="info">{event.category}</Badge>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{new Date(event.date).toLocaleDateString()}</div>
                      <small className="text-muted">{event.time}</small>
                    </td>
                    <td>{event.location}</td>
                    <td>
                      {event.spots_left} / {event.capacity}
                    </td>
                    <td>${parseFloat(event.price).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        onClick={() => {
                          setSelectedEvent({
                            ...event,
                            price: parseFloat(event.price)
                          });
                          setShowModal(true);
                        }}
                      >
                        <FaEdit className="text-primary" />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => handleDelete(event.id)}
                      >
                        <FaTrash className="text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {events.items.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent?.id ? 'Edit Event' : 'Add New Event'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedEvent?.title || ''}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      title: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={selectedEvent?.category || ''}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      category: e.target.value
                    })}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Group Session">Group Session</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Support Group">Support Group</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedEvent?.date || ''}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      date: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedEvent?.time || ''}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      time: e.target.value
                    })}
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={selectedEvent?.location || ''}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  location: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedEvent?.description || ''}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  description: e.target.value
                })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedEvent?.capacity || ''}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      capacity: parseInt(e.target.value)
                    })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedEvent?.price || ''}
                    onChange={(e) => setSelectedEvent({
                      ...selectedEvent,
                      price: parseFloat(e.target.value)
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Presenter</Form.Label>
              <Form.Control
                type="text"
                value={selectedEvent?.presenter || ''}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  presenter: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={selectedEvent?.image || ''}
                onChange={(e) => setSelectedEvent({
                  ...selectedEvent,
                  image: e.target.value
                })}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                style={{ backgroundColor: '#660ff1', border: 'none' }}
              >
                {selectedEvent?.id ? 'Update Event' : 'Add Event'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}