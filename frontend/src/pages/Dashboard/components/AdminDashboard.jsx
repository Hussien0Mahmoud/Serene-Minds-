import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaUserMd, FaUsers, FaCalendarCheck, FaBookReader,
  FaChartLine, FaPercent, FaStar 
} from 'react-icons/fa';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        therapistsRes,
        usersRes,
        appointmentsRes,
        resourcesRes,
        eventsRes,
        adminStatsRes
      ] = await Promise.all([
        axios.get('http://localhost:8000/api/therapists'),
        axios.get('http://localhost:8000/api/users'),
        axios.get('http://localhost:8000/api/appointments'),
        axios.get('http://localhost:8000/api/resources'),
        axios.get('http://localhost:8000/api/events'),
        axios.get('http://localhost:8000/api/adminStats')
      ]);

      // Calculate active users (users with role "user")
      const activeUsers = usersRes.data.filter(user => user.role === 'user').length;

      // Get total appointments count
      const totalAppointments = appointmentsRes.data.length;

      // Calculate average rating from therapists
      const totalRatings = therapistsRes.data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      const averageRating = (totalRatings / therapistsRes.data.length).toFixed(1);

      setStats([
        {
          title: "Total Therapists",
          value: therapistsRes.data.length,
          icon: FaUserMd,
          color: "#4A90E2",
          change: "+12%"
        },
        {
          title: "Active Users",
          value: activeUsers,
          icon: FaUsers,
          color: "#50E3C2",
          change: "+8%"
        },
        {
          title: "Total Appointments",
          value: totalAppointments,
          icon: FaCalendarCheck,
          color: "#FF6B6B",
          change: "+15%"
        },
        {
          title: "Total Resources",
          value: resourcesRes.data.length,
          icon: FaBookReader,
          color: "#FFD93D",
          change: "+20%"
        },
        {
          title: "Success Rate",
          value: `${adminStatsRes.data.successRate}%`,
          icon: FaPercent,
          color: "#4CAF50",
          change: "+5%"
        },
        {
          title: "Average Rating",
          value: averageRating,
          icon: FaStar,
          color: "#F6C90E",
          change: "+10%"
        }
      ]);

    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <h4 className="mb-4">Dashboard Overview</h4>
      <Row className="g-4">
        {stats?.map((stat, index) => (
          <Col key={index} md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="rounded-circle p-3"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <span className={`badge ${stat.change.startsWith('+') ? 'bg-success' : 'bg-danger'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="mb-2">{stat.value}</h3>
                <p className="text-muted mb-0">{stat.title}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}