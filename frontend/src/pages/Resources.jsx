import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Nav } from 'react-bootstrap';
import { FaSearch, FaBook, FaVideo, FaDownload, FaPlay } from 'react-icons/fa';
import axios from 'axios';
import ResourcesHero from '../components/Resources/ResourcesHero';

export default function Resources() {
  const [activeTab, setActiveTab] = useState('books');
  const [resources, setResources] = useState({
    items: [],
    count: 0,
    next: null,
    previous: null
  });
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
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:8000/api/resources/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            type: activeTab === 'books' ? 'Ebook' : 'Video'
          }
        }
      );

      setResources({
        items: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next,
        previous: response.data.previous
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.items.filter(resource => {
    const matchesSearch = searchTerm === '' || (
      (resource?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (resource?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    const matchesCategory = selectedCategory === 'all' || resource?.category === selectedCategory;
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
    <>
      <ResourcesHero />
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
                    backgroundColor: colorPalette.text.light,
                    display: 'flex',
                    flexDirection: 'column'
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
                      src={resource.thumbnail_url || 'placeholder-image-url'} 
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
                      style={{ backgroundColor: colorPalette.base }}
                    >
                      {resource.category}
                    </Badge>
                  </div>
                  
                  <Card.Body className="d-flex flex-column flex-grow-1">
                    {/* Title - Common for both */}
                    <h5 style={{ color: colorPalette.text.dark }}>{resource.title}</h5>

                    {/* Category Badge - Common for both */}
                    <div className="mb-2">
                      <Badge 
                        style={{ 
                          backgroundColor: colorPalette.transparent.light,
                          color: colorPalette.base
                        }}
                      >
                        {resource.category}
                      </Badge>
                    </div>

                    {/* Description - Common for both */}
                    <p className="small mb-3" style={{ color: colorPalette.text.dark }}>
                      {resource.description}
                    </p>

                    <div className="d-flex flex-column gap-2 mb-3">
                      {/* Created By - Common for both */}
                      <div className="d-flex justify-content-between">
                        <small style={{ color: colorPalette.base }}>
                          <strong>{resource.type === 'Video' ? 'Created by:' : 'Author:'}</strong> {resource.author}
                        </small>
                        
                        {/* Duration - Only for Videos */}
                        {resource.type === 'Video' && resource.duration && (
                          <small style={{ color: colorPalette.text.dark }}>
                            <strong>Duration:</strong> {resource.duration} min
                          </small>
                        )}
                      </div>

                      {/* Tags - Common for both */}
                      <div className="mt-2">
                        <div className="d-flex flex-wrap gap-1">
                          {resource.tags?.split(',').map((tag, index) => (
                            <Badge 
                              key={index}
                              style={{ 
                                backgroundColor: colorPalette.transparent.light,
                                color: colorPalette.base
                              }}
                            >
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      variant="primary" 
                      className="w-100 mt-auto"
                      href={resource.url}
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
                          Read Now
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
    </>
  );
}