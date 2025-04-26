import React from 'react';
import { Container } from 'react-bootstrap';

export default function EventsHero() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0f9 100%)',
      padding: '80px 0'
    }}>
      <Container className="text-center">
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#17254E' }}>
          Wellness Events & Workshops
        </h1>
        <p className="lead mb-0" style={{ color: '#4A5568', maxWidth: '800px', margin: '0 auto' }}>
          Join our supportive community events and expert-led workshops designed to enhance your mental well-being and personal growth.
        </p>
      </Container>
    </div>
  );
}