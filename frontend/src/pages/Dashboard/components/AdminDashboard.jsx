import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { 
  FaUserMd, FaUsers, FaCalendarCheck, FaBookReader,
  FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/admin-stats/dashboard/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const { stats: adminStats, upcoming_events } = response.data;

      // Transform the stats data
      setStats([
        {
          title: "Total Therapists",
          value: adminStats.total_therapists,
          icon: FaUserMd,
          color: "#4A90E2",
          change: `${adminStats.user_growth}%`
        },
        {
          title: "Active Users",
          value: adminStats.active_users,
          icon: FaUsers,
          color: "#50E3C2",
          change: `${adminStats.user_growth}%`
        },
        {
          title: "Total Appointments",
          value: adminStats.total_appointments || adminStats.appointments_total || 0,
          icon: FaCalendarCheck,
          color: "#FF6B6B",
          change: "All Time"
        },
        {
          title: "Total Resources",
          value: adminStats.total_resources,
          icon: FaBookReader,
          color: "#FFD93D",
          change: "+20%"
        },
        {
          title: "Upcoming Events",
          value: upcoming_events,
          icon: FaCalendarAlt,
          color: "#F6C90E",
          change: "Future"
        }
      ]);

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.detail || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row className="g-4 mb-4">
          {stats.map((stat, index) => (
            <Col key={index} md={4}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex align-items-center">
                  <div
                    className="rounded-circle p-3 me-3"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <div>
                    <h6 className="mb-0 text-muted">{stat.title}</h6>
                    <h4 className="mb-0">{stat.value}</h4>
                    <small className="text-success">{stat.change}</small>
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