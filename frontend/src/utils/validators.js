/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: 8-16 characters, one digit, one lowercase, one uppercase, one special character
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (!password) {
    result.isValid = false;
    result.errors.push('Password is required');
    return result;
  }

  if (password.length < 8 || password.length > 16) {
    result.isValid = false;
    result.errors.push('Password must be between 8 and 16 characters');
  }

  if (!/\d/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one digit');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one special character');
  }

  return result;
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  return { isValid: true };
};

/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const validatePhone = (phone) => {
  // Basic phone validation - at least 10 digits
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};
