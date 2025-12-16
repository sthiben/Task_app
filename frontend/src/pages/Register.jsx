import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect to classes page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/classes');
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    setShowSuccess(true);
    // Redirect to login page after a short delay
    setTimeout(() => {
      navigate('/login', { 
        state: { message: '¡Registro exitoso! Por favor inicia sesión con tus credenciales.' }
      });
    }, 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Sistema de Gestión de Gimnasio</h1>
          <h2>Registro</h2>
          <p>Crea tu cuenta para comenzar.</p>
        </div>

        {showSuccess ? (
          <div className="success-message">
            <p>¡Registro exitoso! Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <>
            <RegisterForm onSuccess={handleRegisterSuccess} />

            <div className="auth-footer">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="auth-link">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
