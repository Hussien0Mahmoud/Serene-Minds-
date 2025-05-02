import React from 'react';
import { Container } from 'react-bootstrap';

export default function EventsHero() {
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, rgba(102, 15, 241, 0.05) 0%, rgba(102, 15, 241, 0.1) 100%)',
      padding: '80px 0',
      borderBottom: '1px solid rgba(102, 15, 241, 0.1)'
    }}>
      <Container className="text-center">
        <h1 
          className="display-4 fw-bold mb-4" 
          style={{ 
            color: '#660ff1',
            textShadow: '2px 2px 4px rgba(102, 15, 241, 0.1)'
          }}
        >
          Wellness Events & Workshops
        </h1>
        <p 
          className="lead mb-0" 
          style={{ 
            color: '#000000', 
            maxWidth: '800px', 
            margin: '0 auto',
            opacity: 0.8
          }}
        >
          Join our supportive community events and expert-led workshops designed to enhance your mental well-being and personal growth.
        </p>
      </Container>
    </div>
  );
}