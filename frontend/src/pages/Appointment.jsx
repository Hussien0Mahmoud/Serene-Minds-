import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AppointmentHero from '../components/Appointment/AppointmentHero';
import TherapistList from '../components/Appointment/TherapistList';

export default function Appointment() {
  const { isAuthenticated } = useSelector(state => state.user);

  const styles = {
    mainContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    cardContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    signInSection: {
      marginTop: 'auto',
      padding: '2rem 0',
      backgroundColor: '#f8f9fa'
    },
    signInButton: {
      backgroundColor: '#6600f1',
      color: 'white',
      padding: '8px 24px',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.mainContainer}>
      <AppointmentHero />
      <div style={styles.cardContainer}>
        <TherapistList />
      </div>
      {!isAuthenticated && (
        <div style={styles.signInSection} className="text-center">
          <p className="mb-3">To book an appointment, please sign in first</p>
          <Link 
            to="/login" 
            className="btn"
            style={styles.signInButton}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7711ff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6600f1'}
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}