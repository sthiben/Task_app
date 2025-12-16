import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to classes page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/classes');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/classes');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Sistema de Gestión de Gimnasio</h1>
          <h2>Iniciar Sesión</h2>
          <p>¡Bienvenido de nuevo! Por favor inicia sesión en tu cuenta.</p>
        </div>

        <LoginForm onSuccess={handleLoginSuccess} />

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
