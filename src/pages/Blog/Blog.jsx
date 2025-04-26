import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Nav, Button } from 'react-bootstrap';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import BlogHero from './components/BlogHero';
import ArticleCard from './components/ArticleCard';

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  const blogPosts = [
    {
      id: 1,
      title: "Understanding Anxiety: Signs, Symptoms, and Support",
      excerpt: "Learn about the common signs of anxiety and effective coping strategies...",
      author: "Dr. Sarah Williams",
      date: "April 25, 2024",
      category: "Mental Health",
      tags: ["Anxiety", "Mental Health", "Self-Care"],
      image: "https://images.unsplash.com/photo-1474540412665-1cdae210ae6b",
      readTime: "5 min read",
      views: 120,
      trending: 80
    },
    {
      id: 2,
      title: "The Power of Mindfulness in Daily Life",
      excerpt: "Discover how mindfulness practices can improve your mental well-being...",
      author: "Dr. Michael Chen",
      date: "April 24, 2024",
      category: "Mindfulness",
      tags: ["Mindfulness", "Meditation", "Wellness"],
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      readTime: "4 min read",
      views: 150,
      trending: 90
    },
    {
      id: 3,
      title: "Building Healthy Relationships: A Guide",
      excerpt: "Tips and strategies for developing and maintaining healthy relationships...",
      author: "Dr. Emily Rodriguez",
      date: "April 23, 2024",
      category: "Relationships",
      tags: ["Relationships", "Communication", "Mental Health"],
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
      readTime: "6 min read",
      views: 100,
      trending: 70
    },
    {
      id: 4,
      title: "Coping with Depression: A Comprehensive Guide",
      excerpt: "Learn effective strategies and treatments for managing depression, from therapy options to lifestyle changes...",
      author: "Dr. Robert Thompson",
      date: "April 22, 2024",
      category: "Depression",
      tags: ["Depression", "Mental Health", "Treatment"],
      image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2",
      readTime: "8 min read",
      views: 200,
      trending: 100
    },
    {
      id: 5,
      title: "Self-Care Practices for Mental Well-being",
      excerpt: "Discover essential self-care routines and habits that can improve your mental health and emotional balance...",
      author: "Dr. Lisa Chen",
      date: "April 21, 2024",
      category: "Self-Care",
      tags: ["Self-Care", "Wellness", "Mental Health"],
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
      readTime: "5 min read",
      views: 130,
      trending: 85
    },
    {
      id: 6,
      title: "Understanding Panic Attacks",
      excerpt: "Everything you need to know about panic attacks: causes, symptoms, and effective management techniques...",
      author: "Dr. Mark Anderson",
      date: "April 20, 2024",
      category: "Anxiety",
      tags: ["Anxiety", "Panic Attacks", "Mental Health"],
      image: "https://images.unsplash.com/photo-1542596594-649edbc13630",
      readTime: "7 min read",
      views: 110,
      trending: 75
    },
    {
      id: 7,
      title: "The Science of Sleep and Mental Health",
      excerpt: "Explore the crucial connection between sleep quality and mental well-being, with practical tips for better sleep...",
      author: "Dr. Sarah Williams",
      date: "April 19, 2024",
      category: "Wellness",
      tags: ["Sleep", "Mental Health", "Wellness"],
      image: "https://images.unsplash.com/photo-1541199249251-f713e6145474",
      readTime: "6 min read",
      views: 140,
      trending: 95
    },
    {
      id: 8,
      title: "Building Resilience in Challenging Times",
      excerpt: "Learn key strategies to develop emotional resilience and cope with life's difficulties...",
      author: "Dr. James Wilson",
      date: "April 18, 2024",
      category: "Mental Health",
      tags: ["Resilience", "Coping", "Mental Health"],
      image: "https://images.unsplash.com/photo-1542435503-956c469947f6",
      readTime: "5 min read",
      views: 125,
      trending: 88
    },
    {
      id: 9,
      title: "Mindfulness Meditation for Beginners",
      excerpt: "A step-by-step guide to starting your mindfulness meditation practice for better mental health...",
      author: "Dr. Emily Rodriguez",
      date: "April 17, 2024",
      category: "Mindfulness",
      tags: ["Mindfulness", "Meditation", "Beginner"],
      image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7",
      readTime: "4 min read",
      views: 160,
      trending: 98
    }
  ];

  const categories = [
    "Mental Health",
    "Mindfulness",
    "Relationships",
    "Self-Care",
    "Depression",
    "Anxiety",
    "Wellness"
  ];

  const sortPosts = (posts) => {
    switch (activeTab) {
      case 'popular':
        return [...posts].sort((a, b) => b.views - a.views);
      case 'trending':
        return [...posts].sort((a, b) => b.trending - a.trending);
      default:
        return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const filteredPosts = sortPosts(blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }));

  return (
    <>
      <BlogHero />
      <Container className="py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Navigation Tabs */}
          <Nav 
            className="justify-content-center mb-4"
            variant="pills"
          >
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'latest'}
                onClick={() => setActiveTab('latest')}
                className="px-4"
              >
                Latest
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'popular'}
                onClick={() => setActiveTab('popular')}
                className="px-4"
              >
                Popular
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'trending'}
                onClick={() => setActiveTab('trending')}
                className="px-4"
              >
                Trending
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Search and Filters */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-light py-2"
                />
              </InputGroup>
            </Col>
            <Col md={4} className="d-flex gap-2">
              <Button 
                variant="outline-primary"
                className="w-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-2" />
                Filters
              </Button>
              <Button 
                variant="outline-primary"
                className="w-100"
              >
                <FaSortAmountDown className="me-2" />
                Sort
              </Button>
            </Col>
          </Row>

          {/* Filters Section */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0 }}
            className="overflow-hidden mb-4"
          >
            <Row className="bg-light p-3 rounded">
              <Col md={12}>
                <h6 className="mb-3">Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Button
                      key={index}
                      variant={selectedCategory === category ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      style={selectedCategory === category ? 
                        { backgroundColor: '#660ff1', border: 'none' } : 
                        { borderColor: '#660ff1', color: '#660ff1' }
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>
          </motion.div>

          {/* Articles Grid */}
          <Row className="g-4">
            {filteredPosts.map((post) => (
              <Col key={post.id} md={6} lg={4}>
                <ArticleCard post={post} />
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </>
  );
}