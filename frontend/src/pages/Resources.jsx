import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Nav } from 'react-bootstrap';
import { FaSearch, FaBook, FaVideo, FaDownload, FaPlay } from 'react-icons/fa';
import axios from 'axios';

export default function Resources() {
  const [activeTab, setActiveTab] = useState('books');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Advanced color scheme based on #660ff1
  const colorPalette = {
    base: '#660ff1',           // Main purple
    transparent: {
      light: 'rgba(102, 15, 241, 0.1)',   
      medium: 'rgba(102, 15, 241, 0.3)', 
      dark: 'rgba(102, 15, 241, 0.8)'     // Dark purple overlay
    },
    text: {
      light: '#f8f5ff',       // Nearly white with purple tint
      dark: '#2a0966'         // Very dark purple for text
    },
    background: {
      light: '#f3f0ff',       // Very light purple background
      hover: '#7525f2'        // Slightly darker for hover states
    }
  };

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/resources?type=${activeTab === 'books' ? 'E-Book' : 'Video'}`);
      setResources(response.data);
    } catch (err) {
      setError('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'Anxiety & Depression',
    'Stress Management',
    'Relationships',
    'Self-Help',
    'Mindfulness'
  ];

  return (
    <Container className="py-5">
      <Nav variant="tabs" className="mb-4">
        {['books', 'videos'].map(tab => (
          <Nav.Item key={tab}>
            <Nav.Link 
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? {
                backgroundColor: colorPalette.base,
                color: colorPalette.text.light,
                border: 'none'
              } : {
                color: colorPalette.base,
                backgroundColor: colorPalette.transparent.light,
                border: 'none'
              }}
              className="d-flex align-items-center"
            >
              {tab === 'books' ? <FaBook className="me-2" /> : <FaVideo className="me-2" />}
              {tab === 'books' ? 'Books & Articles' : 'Videos & Tutorials'}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text 
              style={{ 
                backgroundColor: colorPalette.transparent.light,
                border: `1px solid ${colorPalette.transparent.medium}`,
                color: colorPalette.base
              }}
            >
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                backgroundColor: colorPalette.transparent.light,
                border: `1px solid ${colorPalette.transparent.medium}`,
                color: colorPalette.text.dark
              }}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              backgroundColor: colorPalette.transparent.light,
              border: `1px solid ${colorPalette.transparent.medium}`,
              color: colorPalette.text.dark
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: colorPalette.base }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row className="g-4">
          {filteredResources.map((resource) => (
            <Col key={resource.id} md={6} lg={4}>
              <Card 
                className="h-100 border-0 shadow-sm"
                style={{ 
                  transition: 'all 0.3s ease',
                  backgroundColor: colorPalette.text.light 
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 10px 20px ${colorPalette.transparent.medium}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={resource.thumbnailUrl || resource.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {resource.type === 'Video' && (
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: colorPalette.transparent.medium }}
                    >
                      <FaPlay size={48} color={colorPalette.text.light} />
                    </div>
                  )}
                  <Badge 
                    className="position-absolute top-0 end-0 m-2"
                    style={{                       backgroundColor: '#660ff1', // Changed from colorPalette.base
                      color: '#ffffff'  // White text for better contrast
                    }}
                  >
                    {resource.category}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <h5 style={{ color: colorPalette.text.dark }}>{resource.title}</h5>
                  <p className="small mb-3" style={{ color: colorPalette.text.dark }}>
                    {resource.description}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small style={{ color: colorPalette.base }}>By {resource.author}</small>
                    {resource.type === 'Video' && (
                      <small style={{ color: colorPalette.text.dark }}>{resource.duration}</small>
                    )}
                  </div>

                  <div className="mb-3">
                    {resource.tags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        className="me-2 mb-2"
                        style={{ 
                          backgroundColor: '#660ff1', // Light purple background
                          color: '#fff', // Purple text
                          border: '1px solid rgba(102, 15, 241, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#660ff1';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#660ff1';
                          e.target.style.color = '#fff';
                        }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-100 mt-auto"
                    href={resource.url || resource.bookUrl}
                    target="_blank"
                    style={{ 
                      backgroundColor: colorPalette.base,
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorPalette.background.hover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorPalette.base}
                  >
                    {resource.type === 'Video' ? (
                      <>
                        <FaPlay className="me-2" />
                        Watch Now
                      </>
                    ) : (
                      <>
                        <FaDownload className="me-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}