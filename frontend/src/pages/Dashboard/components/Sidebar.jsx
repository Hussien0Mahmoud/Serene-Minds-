import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaHome, FaUserMd, FaUsers, FaCalendarAlt, FaBook, 
  FaUserCircle 
} from 'react-icons/fa';

export default function Sidebar({ userRole }) {
  const adminMenuItems = [
    { icon: FaHome, title: 'Dashboard', link: '/dashboard' },
    { icon: FaUserMd, title: 'Manage Therapists', link: '/dashboard/therapists' },
    { icon: FaUsers, title: 'Manage Users', link: '/dashboard/users' },
    { icon: FaCalendarAlt, title: 'Appointments', link: '/dashboard/appointments' },
    { icon: FaBook, title: 'Resources', link: '/dashboard/resources' },
    { icon: FaCalendarAlt, title: 'Manage Events', link: '/dashboard/events' }
  ];

  const therapistMenuItems = [
    { icon: FaHome, title: 'Dashboard', link: '/dashboard' },
    { icon: FaCalendarAlt, title: 'My Appointments', link: '/dashboard/appointments' },
    { icon: FaUsers, title: 'My Clients', link: '/dashboard/clients' },
    { icon: FaBook, title: 'Resources', link: '/dashboard/resources' },
    { icon: FaUserCircle, title: 'Profile', link: '/dashboard/profile' }
  ];

  const userMenuItems = [
    { icon: FaHome, title: 'Dashboard', link: '/dashboard' },
    { icon: FaCalendarAlt, title: 'My Appointments', link: '/dashboard/appointments' },
    { icon: FaBook, title: 'Resources', link: '/dashboard/resources' },
    { icon: FaUserCircle, title: 'Profile', link: '/dashboard/profile' }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : 
                   userRole === 'therapist' ? therapistMenuItems : 
                   userMenuItems;

  return (
    <div className="sidebar bg-dark text-light p-3" style={{ minWidth: '250px', minHeight: '100vh' }}>
      <Nav className="flex-column">
        {menuItems.map((item, index) => (
          <Nav.Item key={index}>
            <Link 
              to={item.link} 
              className="nav-link text-light d-flex align-items-center p-3"
            >
              <item.icon className="me-2" />
              {item.title}
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
}