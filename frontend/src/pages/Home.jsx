import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaDownload, FaUsers, FaStar, FaArrowRight } from 'react-icons/fa';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import StateSection from '../components/Home/StateSection';
import Testimonials from '../components/Home/Testimonials';
import ServiceHighlights from '../components/Home/ServiceHighlights';

export function Home() {
  return (
    <>
      <Hero />
      <StateSection />
      <ServiceHighlights />
      <Features />
      <Testimonials />
    </>
  );
}
