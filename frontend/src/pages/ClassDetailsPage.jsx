import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classService from '../services/classService';
import ClassDetails from '../components/classes/ClassDetails';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';
import './ClassDetailsPage.css';

/**
 * ClassDetailsPage - Page component for displaying full class details
 * Fetches class data by ID from URL params and displays it
 * Handles loading and error states
 */
const ClassDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await classService.getClassById(id);
        setClassData(data);
      } catch (err) {
        setError(err.message || 'Failed to load class details');
        console.error('Error fetching class details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/classes');
  };

  /**
   * Handle adding a comment to the class
   * @param {Object} commentData - Comment data with userId, name, and text
   */
  const handleAddComment = async (commentData) => {
    try {
      const updatedClass = await classService.addComment(id, commentData);
      // Update the class data with the new comment
      setClassData(updatedClass);
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  /**
   * Handle enrolling in the class
   */
  const handleEnroll = async () => {
    if (!user?._id) {
      setError('You must be logged in to enroll');
      return;
    }

    try {
      const updatedClass = await classService.enrollInClass(id, user._id);
      setClassData(updatedClass);
    } catch (err) {
      console.error('Error enrolling in class:', err);
      setError(err.message || 'Failed to enroll in class');
    }
  };

  if (loading) {
    return (
      <div className="class-details-page">
        <Loader fullscreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="class-details-page">
        <div className="error-container">
          <h2>Error Loading Class</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="class-details-page">
        <div className="error-container">
          <h2>Class Not Found</h2>
          <p>The class you're looking for doesn't exist.</p>
          <button onClick={handleBack} className="back-button">
            Back to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="class-details-page">
      <ClassDetails 
        classData={classData} 
        onBack={handleBack}
        onAddComment={handleAddComment}
        onEnroll={handleEnroll}
        currentUser={user}
      />
    </div>
  );
};

export default ClassDetailsPage;
