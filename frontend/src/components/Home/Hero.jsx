import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaDownload, FaUsers, FaStar, FaArrowRight } from 'react-icons/fa';

import '../../styles/home/hero.css';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div style={{ background: 'linear-gradient(to right, #f5e3e1, #eef0ee, #dcefeb)' }} className="py-5">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={5}>
            <h1 className="display-4 fw-bold mb-4" style={{ color: '#17254E' }}>
              Your Journey to Better Mental Health Starts Here
            </h1>
            <p className="lead mb-4" style={{ color: '#17254E' }}>
              Experience confidential online therapy with licensed professionals. 
              Get support whenever you need it, from the comfort of your home.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button 
                style={{ backgroundColor: '#660ff1', border: 'none' }} 
                size="lg" 
                className="fw-bold text-white"
              >
                <Link to="/appointment" className="text-white text-decoration-none">
                Start Therapy
                </Link>
                
              </Button>
              <Button 
                style={{ 
                  backgroundColor: 'transparent', 
                  border: '2px solid #660ff1',
                  color: '#660ff1'
                }}
                size="lg" 
                className="d-flex align-items-center gap-2"
              >
                <Link to="/about" className="text-decoration-none " style={{ 
                  backgroundColor: 'transparent', 
                  color: '#660ff1'
                }}> 

                About Us <FaArrowRight />
                </Link>
              </Button>
            </div>
            <Row className="mt-5">
              {['24/7 Care', 'Expert Help', 'Safe Space'].map((item, index) => (
                <Col xs={4} key={index}>
                  <div className="border-start border-3 ps-3" style={{ borderColor: '#2FC7A1' }}>
                    <h3 className="fw-bold mb-0" style={{ color: '#17254E' }}>
                      {item.split(' ')[0]}
                    </h3>
                    <p className="mb-0" style={{ color: '#17254E', fontSize: '0.9rem' }}>
                      {item.split(' ')[1]}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>

          <Col lg={7}>
            <div className="position-relative ms-lg-5">
              <div className="position-absolute" style={{ top: '-20px', left: '20px', zIndex: 2 }}>
                <div style={{ backgroundColor: '#660ff1' }} className="text-white p-3 rounded-3 shadow-lg">
                  <FaStar className="me-2" />
                  <span className="fw-bold">Helping 50K+ individuals</span>
                </div>
              </div>

              <div className="position-relative">
                <img 
                  src="https://www.talktoangel.com/images/newsletter/TTA-O5QNLNBM/Mental%20Wellness%20Tips%20for%20Teachers_Inner.svg" 
                  alt="Online Therapy Session" 
                  className="rounded-4 shadow-lg img-fluid"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                <div className="position-absolute" style={{ bottom: '30px', right: '-20px' }}>
                  <Card className="border-0 shadow-lg p-3" style={{ maxWidth: '200px', backgroundColor: '#dcefeb' }}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ backgroundColor: '#FE543D' }} className="rounded-circle p-2">
                        <FaDownload className="text-white" />
                      </div>
                      <div>
                        <small style={{ color: '#17254E' }}>Available Now</small>
                        <p className="fw-bold mb-0" style={{ color: '#17254E' }}>Crisis Support</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
