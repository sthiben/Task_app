import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { CLASS_TYPES, PRIORITY_LEVELS } from '../../utils/constants';
import './ClassForm.css';

const ClassForm = ({ classData, userId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Yoga',
    instructor: '',
    startDate: '',
    endDate: '',
    priority: 'Media',
    color: '#8b5cf6',
    maxCapacity: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with existing class data in edit mode
  useEffect(() => {
    if (classData) {
      setFormData({
        title: classData.title || '',
        description: classData.description || '',
        type: classData.type || 'Yoga',
        instructor: classData.instructor || '',
        startDate: classData.startDate ? formatDateForInput(classData.startDate) : '',
        endDate: classData.endDate ? formatDateForInput(classData.endDate) : '',
        priority: classData.priority || 'Media',
        color: classData.color || '#8b5cf6',
        maxCapacity: classData.maxCapacity || ''
      });
    }
  }, [classData]);

  /**
   * Format date for datetime-local input
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
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

  /**
   * Validate form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.maxCapacity || formData.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Max capacity must be greater than 0';
    }

    // Date range validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        maxCapacity: parseInt(formData.maxCapacity, 10)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to save class. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="class-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {classData ? 'Edit Class' : 'Create New Class'}
      </h2>

      {errors.submit && (
        <div className="form-error-message">
          {errors.submit}
        </div>
      )}

      <div className="form-row">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter class title"
          required
        />
      </div>

      <div className="form-row">
        <div className="input-wrapper">
          <label htmlFor="description" className="input-label">
            Description<span className="required-asterisk">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter class description"
            required
            className={`textarea-field ${errors.description ? 'input-error' : ''}`}
            rows="4"
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>
      </div>

      <div className="form-row form-row-two">
        <div className="input-wrapper">
          <label htmlFor="type" className="input-label">
            Class Type<span className="required-asterisk">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="select-field"
            required
          >
            {CLASS_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Instructor"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          error={errors.instructor}
          placeholder="Enter instructor name"
          required
        />
      </div>

      <div className="form-row form-row-two">
        <Input
          label="Start Date"
          name="startDate"
          type="datetime-local"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          required
        />

        <Input
          label="End Date"
          name="endDate"
          type="datetime-local"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          required
        />
      </div>

      <div className="form-row form-row-three">
        <div className="input-wrapper">
          <label htmlFor="priority" className="input-label">
            Priority<span className="required-asterisk">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="select-field"
            required
          >
            {PRIORITY_LEVELS.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="input-wrapper">
          <label htmlFor="color" className="input-label">
            Color<span className="required-asterisk">*</span>
          </label>
          <input
            id="color"
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="color-picker"
            required
          />
        </div>

        <Input
          label="Max Capacity"
          name="maxCapacity"
          type="number"
          value={formData.maxCapacity}
          onChange={handleChange}
          error={errors.maxCapacity}
          placeholder="0"
          min="1"
          required
        />
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (classData ? 'Update Class' : 'Create Class')}
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;
