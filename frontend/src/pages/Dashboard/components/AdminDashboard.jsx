import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { 
  FaUserMd, FaUsers, FaCalendarCheck, FaBookReader,
FaPercent, FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Appointments Distribution'
    }
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);
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

      const { stats: adminStats, appointments_by_status, upcoming_events } = response.data;

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
          title: "Today's Appointments",
          value: adminStats.appointments_today,
          icon: FaCalendarCheck,
          color: "#FF6B6B",
          change: "Today"
        },
        {
          title: "Total Resources",
          value: adminStats.total_resources,
          icon: FaBookReader,
          color: "#FFD93D",
          change: "+20%"
        },
        {
          title: "Success Rate",
          value: `${adminStats.success_rate}%`,
          icon: FaPercent,
          color: "#4CAF50",
          change: `+${adminStats.success_rate}%`
        },
        {
          title: "Upcoming Events",
          value: upcoming_events,
          icon: FaCalendarAlt,
          color: "#F6C90E",
          change: "Future"
        }
      ]);

      // Update appointment status chart data
      if (appointments_by_status) {
        setChartData({
          labels: appointments_by_status.map(item => item.status),
          datasets: [{
            data: appointments_by_status.map(item => item.count),
            backgroundColor: [
              '#4A90E2', // Confirmed
              '#50E3C2', // Completed
              '#FF6B6B', // Cancelled
              '#FFD93D'  // Pending
            ]
          }]
        });
      }

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
        <>
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

          {/* Additional dashboard components like charts */}
          {chartData && (
            <Row>
              <Col md={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-4">Appointments by Status</h5>
                    <Doughnut data={chartData} options={chartOptions} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}