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

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/resources?type=${activeTab === 'books' ? 'E-Book' : 'Video'}`);
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
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'books'} 
            onClick={() => setActiveTab('books')}
          >
            <FaBook className="me-2" />
            Books & Articles
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')}
          >
            <FaVideo className="me-2" />
            Videos & Tutorials
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text className="bg-light border-0">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-light"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-light border-0"
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
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row className="g-4">
          {filteredResources.map((resource) => (
            <Col key={resource.id} md={6} lg={4}>
              <Card className="h-100 border-0 shadow-sm hover-card">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={resource.thumbnailUrl || resource.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {resource.type === 'Video' && (
                    <div 
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                      <FaPlay size={48} color="white" />
                    </div>
                  )}
                  <Badge 
                    className="position-absolute top-0 end-0 m-2"
                    style={{ backgroundColor: '#660ff1' }}
                  >
                    {resource.category}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <div>
                    <h5 className="mb-2">{resource.title}</h5>
                    <p className="text-muted small mb-3">{resource.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">By {resource.author}</small>
                      {resource.type === 'Video' && (
                        <small className="text-muted">{resource.duration}</small>
                      )}
                    </div>

                    <div className="mb-3">
                      {resource.tags.map((tag, i) => (
                        <Badge 
                          key={i} 
                          className="me-2 mb-2"
                          bg="light"
                          text="dark"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-100 mt-auto"
                    href={resource.url || resource.bookUrl}
                    target="_blank"
                    style={{ backgroundColor: '#660ff1', border: 'none' }}
                  >
                    {resource.type === 'Video' ? (
                      <>
                        <FaPlay className="me-2" />
                        Watch Now
                      </>
                    ) : (
                      <>
                        <FaDownload className="me-2" />
                        Download Now
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