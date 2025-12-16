import { useState } from 'react';
import { validateEmail, validatePassword, validateRequired, validatePhone } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { MEMBERSHIP_TYPES } from '../../utils/constants';

const RegisterForm = ({ onSuccess }) => {
  const { register, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    membershipType: 'Básica'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate username
    const usernameValidation = validateRequired(formData.username, 'Nombre de usuario');
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }

    // Validate email
    const emailValidation = validateRequired(formData.email, 'Correo electrónico');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join('. ');
    }

    // Validate phone
    const phoneValidation = validateRequired(formData.phone, 'Teléfono');
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Por favor ingresa un número de teléfono válido (al menos 10 dígitos)';
    }

    // Validate membership type
    if (!formData.membershipType) {
      newErrors.membershipType = 'Por favor selecciona un tipo de membresía';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled by AuthContext and displayed via authError
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {authError && (
        <div className="error-message auth-error">
          {authError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="username">Nombre de Usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={errors.username ? 'error' : ''}
          disabled={isSubmitting}
          autoComplete="username"
        />
        {errors.username && (
          <span className="error-message">{errors.username}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          disabled={isSubmitting}
          autoComplete="new-password"
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
        <small className="form-hint">
          8-16 caracteres, un dígito, una minúscula, una mayúscula, un carácter especial
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'error' : ''}
          disabled={isSubmitting}
          autoComplete="tel"
        />
        {errors.phone && (
          <span className="error-message">{errors.phone}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="membershipType">Tipo de Membresía</label>
        <select
          id="membershipType"
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          className={errors.membershipType ? 'error' : ''}
          disabled={isSubmitting}
        >
          {MEMBERSHIP_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.membershipType && (
          <span className="error-message">{errors.membershipType}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
};

export default RegisterForm;
