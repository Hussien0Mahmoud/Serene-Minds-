import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import EventsHero from '../components/Events/EventsHero';
import EventsList from '../components/Events/EventsList';

export default function Events() {
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFilter: 'all'
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <EventsHero />
      <Container className="py-4">
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="position-relative">
              <FaSearch 
                className="position-absolute"
                style={{ 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#660ff1',
                  opacity: 0.5
                }}
              />
              <Form.Control
                type="search"
                placeholder="Search events..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                style={{
                  borderColor: '#660ff1',
                  boxShadow: 'none',
                  paddingLeft: '40px'
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <div className="position-relative">
              <FaCalendarAlt
                className="position-absolute"
                style={{ 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#660ff1',
                  opacity: 0.5
                }}
              />
              <Form.Select
                value={filters.dateFilter}
                onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
                style={{
                  borderColor: '#660ff1',
                  boxShadow: 'none',
                  paddingLeft: '40px'
                }}
              >
                <option value="all">All Events</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="future">Upcoming</option>
              </Form.Select>
            </div>
          </Col>
        </Row>
      </Container>
      <EventsList filters={filters} />
    </>
  );
}