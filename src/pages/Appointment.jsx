import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AppointmentHero from '../components/Appointment/AppointmentHero';
import TherapistList from '../components/Appointment/TherapistList';

export default function Appointment() {
  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <>
      <AppointmentHero />
      <TherapistList />
      {!isAuthenticated && (
        <div className="text-center py-4">
          <p className="mb-3">To book an appointment, please sign in first</p>
          <Link 
            to="/login" 
            className="btn"
            style={{
              backgroundColor: '#660ff1',
              color: 'white',
              padding: '8px 24px'
            }}
          >
            Sign In
          </Link>
        </div>
      )}
    </>
  );
}