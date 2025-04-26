import React from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { FaUser, FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';

export default function TherapistDashboard() {
  const upcomingAppointments = [
    {
      id: 1,
      patient: "John Doe",
      time: "10:00 AM",
      type: "Video Call",
      status: "Confirmed"
    },
    {
      id: 2,
      patient: "Jane Smith",
      time: "11:30 AM",
      type: "Audio Call",
      status: "Pending"
    }
  ];

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Today's Appointments</h5>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.type}</td>
                      <td>
                        <Badge 
                          bg={appointment.status === "Confirmed" ? "success" : "warning"}
                        >
                          {appointment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-3">Quick Stats</h5>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <small className="text-muted d-block">Total Patients</small>
                  <h3 className="mb-0">124</h3>
                </div>
                <FaUser size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Rating</h5>
              <div className="d-flex align-items-center">
                <h3 className="mb-0 me-2">4.9</h3>
                <div className="text-warning">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              <small className="text-muted">Based on 98 reviews</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}