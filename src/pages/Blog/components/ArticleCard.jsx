import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaUser, FaCalendar, FaBookmark, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ArticleCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-100 border-0 shadow-sm article-card">
        <div className="position-relative">
          <Card.Img 
            variant="top" 
            src={post.image}
            style={{ height: '200px', objectFit: 'cover' }}
            className="article-image"
          />
          <div className="article-overlay">
            <div className="article-actions">
              <button className="action-btn">
                <FaBookmark />
              </button>
              <button className="action-btn">
                <FaShare />
              </button>
            </div>
          </div>
          <Badge 
            className="position-absolute category-badge"
            style={{ 
              backgroundColor: '#660ff1',
              top: '15px',
              left: '15px'
            }}
          >
            {post.category}
          </Badge>
        </div>

        <Card.Body>
          <Card.Title className="h5 mb-3 article-title">
            {post.title}
          </Card.Title>
          <Card.Text className="text-muted small article-excerpt">
            {post.excerpt}
          </Card.Text>
          
          <hr className="my-3" />

          <div className="d-flex justify-content-between align-items-center">
            <div className="author-info d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${post.author.replace(' ', '+')}&background=660ff1&color=fff`}
                alt={post.author}
                className="rounded-circle me-2"
                style={{ width: '30px', height: '30px' }}
              />
              <div>
                <small className="fw-bold text-dark">{post.author}</small>
                <div className="d-flex align-items-center text-muted smaller">
                  <FaCalendar className="me-1" size={10} />
                  <span>{post.date}</span>
                  <span className="mx-1">•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="bg-white border-0 pt-0">
          <div className="d-flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge 
                key={index} 
                bg="light" 
                text="dark" 
                className="tag-badge"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}