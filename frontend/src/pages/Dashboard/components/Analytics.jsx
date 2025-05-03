import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaChartLine, FaUsers, FaUserMd, FaCalendarCheck, 
  FaStar, FaPercentage 
} from 'react-icons/fa';
import axios from 'axios';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/adminStats');
      setStats([
        {
          title: 'Total Therapists',
          value: response.data.totalTherapists,
          icon: FaUserMd,
          color: '#4A90E2',
          change: '+12%'
        },
        {
          title: 'Active Users',
          value: response.data.activeUsers,
          icon: FaUsers,
          color: '#50E3C2',
          change: '+8%'
        },
        {
          title: 'Appointments',
          value: response.data.appointmentsToday,
          icon: FaCalendarCheck,
          color: '#FF6B6B',
          change: '+15%'
        },
        {
          title: 'Success Rate',
          value: `${response.data.successRate}%`,
          icon: FaPercentage,
          color: '#4CAF50',
          change: '+5%'
        },
        {
          title: 'User Growth',
          value: `${response.data.userGrowth}%`,
          icon: FaChartLine,
          color: '#9B51E0',
          change: '+10%'
        },
        {
          title: 'Average Rating',
          value: '4.8',
          icon: FaStar,
          color: '#FFD93D',
          change: '+2%'
        }
      ]);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
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
      <h4 className="mb-4">Analytics Overview</h4>
      
      <Row className="g-4">
        {stats?.map((stat, index) => (
          <Col key={index} md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div
                    className="rounded-circle p-3"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon size={24} color={stat.color} />
                  </div>
                  <span 
                    className={`badge ${
                      stat.change.startsWith('+') ? 'bg-success' : 'bg-danger'
                    }`}
                  >
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

      {/* Additional analytics visualizations can be added here */}
    </Container>
  );
}