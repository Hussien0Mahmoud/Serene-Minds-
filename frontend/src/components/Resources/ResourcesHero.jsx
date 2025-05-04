import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBook, FaVideo } from 'react-icons/fa';
import './ResourcesHero.css';

export default function ResourcesHero() {
  return (
    <div className="resources-hero py-4">
      <Container>
        <Row className="align-items-center">
          <Col lg={8}>
            <h2 className="text-white mb-2">
              Mental Health Resources
            </h2>
            <p className="text-white-50 mb-0">
              Explore our curated collection of books, articles, and videos to support your mental wellness journey
            </p>
          </Col>
          <Col lg={4} className="d-none d-lg-flex justify-content-end">
            <div className="d-flex gap-4">
              <div className="stat-box">
                <FaBook className="stat-icon" />
                <div>
                  <p className="mb-0">Books & Articles</p>
                </div>
              </div>
              <div className="stat-box">
                <FaVideo className="stat-icon" />
                <div>
                  <p className="mb-0">Videos & Tutorials</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}