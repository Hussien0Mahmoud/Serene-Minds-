import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaCalendarCheck, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import axios from 'axios';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState({
    items: [],
    count: 0,
    next: null,
    previous: null
  });
  const [therapists, setTherapists] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/appointments/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAppointments({
        items: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      });
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    if (!status) return 'secondary'; // Return a default color if status is undefined/null
    
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'primary';
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const updatedData = {
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        status: selectedAppointment.status,
        type: selectedAppointment.type,
        notes: selectedAppointment.notes,
        duration: selectedAppointment.duration
      };

      await axios.patch(
        `http://localhost:8000/api/appointments/${selectedAppointment.id}/`, 
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setShowModal(false);
      await fetchData();
      alert('Appointment updated successfully!');
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err.response?.data?.detail || 'Failed to update appointment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:8000/api/appointments/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete appointment');
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <FaCalendarCheck className="me-2" />
            Manage Appointments
          </h4>
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
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Therapist</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.items.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="fw-bold">{appointment.date}</div>
                      <small className="text-muted">{appointment.time}</small>
                    </td>
                    <td>{appointment.user_name}</td>
                    <td>{appointment.therapist_name}</td>
                    <td>
                      <Badge bg="info">{appointment.type}</Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="fw-bold">
                        ${parseFloat(appointment.payment?.amount).toFixed(2)}
                      </div>
                      <small className={`text-${appointment.payment?.status === 'Paid' ? 'success' : 'warning'}`}>
                        {appointment.payment?.status}
                      </small>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        title="View Details"
                        onClick={() => handleView(appointment)}
                      >
                        <FaEye className="text-primary" />
                      </Button>
                      <Button
                        variant="link"
                        className="me-2 p-0"
                        title="Edit Appointment"
                        onClick={() => handleEdit(appointment)}
                      >
                        <FaEdit className="text-success" />
                      </Button>
                      <Button
                        variant="link"
                        className="p-0"
                        title="Delete Appointment"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <FaTrash className="text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {appointments.items.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={selectedAppointment?.date || ''}
                    onChange={(e) => setSelectedAppointment({
                      ...selectedAppointment,
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
                    value={selectedAppointment?.time || ''}
                    onChange={(e) => setSelectedAppointment({
                      ...selectedAppointment,
                      time: e.target.value
                    })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={selectedAppointment?.status || ''}
                onChange={(e) => setSelectedAppointment({
                  ...selectedAppointment,
                  status: e.target.value
                })}
                required
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={selectedAppointment?.type || ''}
                onChange={(e) => setSelectedAppointment({
                  ...selectedAppointment,
                  type: e.target.value
                })}
                required
              >
                <option value="Video Call">Video Call</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Chat Session">Chat Session</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedAppointment?.notes || ''}
                onChange={(e) => setSelectedAppointment({
                  ...selectedAppointment,
                  notes: e.target.value
                })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" style={{ backgroundColor: '#660ff1', border: 'none' }}>
                Update Appointment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="appointment-details">
            <p><strong>Patient:</strong> {selectedAppointment?.user_name}</p>
            <p><strong>Therapist:</strong> {selectedAppointment?.therapist_name}</p>
            <p><strong>Date:</strong> {selectedAppointment?.date}</p>
            <p><strong>Time:</strong> {selectedAppointment?.time}</p>
            <p><strong>Type:</strong> {selectedAppointment?.type}</p>
            <p><strong>Status:</strong> 
              {selectedAppointment?.status && (
                <Badge bg={getStatusBadgeColor(selectedAppointment.status)} className="ms-2">
                  {selectedAppointment.status}
                </Badge>
              )}
            </p>
            <p><strong>Duration:</strong> {selectedAppointment?.duration} minutes</p>
            <p><strong>Notes:</strong> {selectedAppointment?.notes}</p>
            <p><strong>Payment:</strong></p>
            <ul className="list-unstyled ms-3">
              <li>Amount: ${selectedAppointment?.payment?.amount}</li>
              <li>Status: {selectedAppointment?.payment?.status}</li>
              <li>Method: {selectedAppointment?.payment?.method}</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}