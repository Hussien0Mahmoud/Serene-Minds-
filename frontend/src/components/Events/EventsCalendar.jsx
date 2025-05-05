import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';

export default function EventsCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const eventDates = {
    '2024-04-25': ['Group Therapy Session', 'Mindfulness Workshop'],
    '2024-04-26': ['Stress Management Seminar'],
    '2024-04-28': ['Art Therapy Workshop', 'Support Group Meeting']
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);

    const formattedDate = newDate.toISOString().split('T')[0];
    setEvents(eventDates[formattedDate] || []);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Calendar
                onChange={handleDateChange}
                value={date}
                className="w-100"
                tileClassName={({ date }) => {
                  const formattedDate = date.toISOString().split('T')[0];
                  return eventDates[formattedDate] ? 'has-events' : null;
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h4 className="mb-4">Events on {date.toLocaleDateString()}</h4>
              {events.length > 0 ? (
                <ul className="list-unstyled">
                  {events.map((event, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-3 p-3 bg-light rounded"
                    >
                      {event}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No events scheduled for this date</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}