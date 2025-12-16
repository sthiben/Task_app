import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import './Profile.css';

/**
 * Profile page - Display and edit user profile information
 */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchUserProfile();
    }
  }, [user?._id]);

  const fetchUserProfile = async () => {
    if (!user?._id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserById(user._id);
      setProfileData(data);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || ''
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone format';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setUpdateLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const updatedUser = await userService.updateUser(user._id, formData);
      
      // Update user in AuthContext
      updateUser(updatedUser);
      
      // Update local profile data
      setProfileData(updatedUser);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: profileData.username || '',
      email: profileData.email || '',
      phone: profileData.phone || ''
    });
    setFormErrors({});
    setError(null);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <Loader />
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">{error}</div>
          <Button onClick={fetchUserProfile}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h2>Edit Information</h2>
                
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={formErrors.username}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                />

                <div className="form-actions">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="profile-info-grid">
                  <div className="info-item">
                    <label>Username</label>
                    <p>{profileData?.username || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{profileData?.email || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{profileData?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h2>Membership Information</h2>
                <div className="profile-info-grid">
                  <div className="info-item">
                    <label>Membership Type</label>
                    <p className={`membership-badge ${profileData?.membershipType?.toLowerCase()}`}>
                      {profileData?.membershipType || 'N/A'}
                    </p>
                  </div>
                  <div className="info-item">
                    <label>Start Date</label>
                    <p>{formatDate(profileData?.membershipStartDate)}</p>
                  </div>
                  <div className="info-item">
                    <label>End Date</label>
                    <p>{formatDate(profileData?.membershipEndDate)}</p>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <p className={`status-badge ${profileData?.isActive ? 'active' : 'inactive'}`}>
                      {profileData?.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
