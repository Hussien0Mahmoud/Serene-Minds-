import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaHandHoldingHeart, FaUserFriends, FaStar } from 'react-icons/fa';
import CountUp from 'react-countup';
import '../../styles/home/statsSection.css';

export default function StateSection() {
  const stats = [
    {
      icon: FaHandHoldingHeart,
      count: 5000,
      suffix: '+',
      label: 'People Supported',
      gradient: 'support-gradient'
    },
    {
      icon: FaUserFriends,
      count: 100,
      suffix: '+',
      label: 'Licensed Therapists',
      gradient: 'therapist-gradient'
    },
    {
      icon: FaStar,
      count: 4.9,
      suffix: '/5',
      label: 'Client Satisfaction',
      gradient: 'rating-gradient'
    }
  ];

  return (
    <div className="stats-section py-5" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0f9 100%)' }}>
      <Container>
        <Row className="text-center g-4">
          {stats.map((stat, index) => (
            <Col md={4} key={index}>
              <Card className="stat-card h-100 border-0 py-4 px-3">
                <Card.Body>
                  <div className={`icon-wrapper mb-3 ${stat.gradient}`}>
                    <stat.icon size={40} className="text-white" />
                  </div>
                  <h2 className="stat-number mb-2">
                    <CountUp
                      end={stat.count}
                      decimals={stat.count % 1 !== 0 ? 1 : 0}
                      duration={2.5}
                    />
                    {stat.suffix}
                  </h2>
                  <p className="stat-label mb-0">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
