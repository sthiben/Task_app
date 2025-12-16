import { useState } from 'react';
import { CLASS_TYPE_COLORS, STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';
import Button from '../common/Button';
import './ClassDetails.css';

/**
 * ClassDetails - Component for displaying full class information
 * Shows all class details including assignees and comments
 * 
 * @param {Object} classData - Full class object with all details
 * @param {Function} onBack - Callback function to navigate back
 * @param {Function} onAddComment - Callback function to add a comment
 * @param {Object} currentUser - Current authenticated user
 */
const ClassDetails = ({ classData, onBack, onAddComment, onEnroll, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCommentDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const typeColor = CLASS_TYPE_COLORS[classData.type] || CLASS_TYPE_COLORS['Otro'];
  const statusColor = STATUS_COLORS[classData.status] || '#6b7280';
  const priorityColor = PRIORITY_COLORS[classData.priority] || '#6b7280';

  const enrollmentPercentage = classData.maxCapacity > 0 
    ? ((classData.enrolledUsers?.length || 0) / classData.maxCapacity) * 100 
    : 0;

  const isFull = (classData.enrolledUsers?.length || 0) >= classData.maxCapacity;
  const isEnrolled = currentUser && classData.enrolledUsers?.some(
    userId => userId.toString() === currentUser._id.toString()
  );

  /**
   * Handle comment submission
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate comment text
    if (!commentText.trim()) {
      setCommentError('Por favor ingresa un comentario');
      return;
    }

    if (!currentUser) {
      setCommentError('Debes iniciar sesión para comentar');
      return;
    }

    try {
      setIsSubmitting(true);
      setCommentError(null);
      
      await onAddComment({
        userId: currentUser._id,
        name: currentUser.username,
        text: commentText.trim()
      });
      
      // Clear the form on success
      setCommentText('');
    } catch (err) {
      setCommentError(err.message || 'Error al agregar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="class-details">
      <div className="class-details-header">
        <Button variant="secondary" onClick={onBack}>
          ← Volver a Clases
        </Button>
      </div>

      <div className="class-details-content">
        {/* Main Information Card */}
        <div className="class-details-card">
          <div className="class-details-title-section">
            <h1 className="class-details-title">{classData.title}</h1>
            <div className="class-details-badges">
              <span 
                className="class-details-badge status-badge"
                style={{ backgroundColor: statusColor }}
              >
                {classData.status}
              </span>
              <span 
                className="class-details-badge priority-badge"
                style={{ backgroundColor: priorityColor }}
              >
                {classData.priority}
              </span>
            </div>
          </div>

          <div 
            className="class-details-type"
            style={{ color: typeColor }}
          >
            {classData.type}
          </div>

          {classData.description && (
            <div className="class-details-description">
              <h3>Descripción</h3>
              <p>{classData.description}</p>
            </div>
          )}

          <div className="class-details-info-grid">
            <div className="info-item">
              <span className="info-label">Instructor</span>
              <span className="info-value">{classData.instructor}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Fecha de Inicio</span>
              <span className="info-value">{formatDate(classData.startDate)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Fecha de Fin</span>
              <span className="info-value">{formatDate(classData.endDate)}</span>
            </div>
          </div>

          {/* Enrollment Section */}
          <div className="class-details-enrollment">
            {currentUser && (
              <div className="enrollment-header">
                {isEnrolled ? (
                  <Button variant="success" disabled>
                    ✓ Inscrito
                  </Button>
                ) : isFull ? (
                  <Button variant="secondary" disabled>
                    Clase Llena
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => onEnroll && onEnroll()}
                  >
                    Inscribirse en la Clase
                  </Button>
                )}
              </div>
            )}
            <div className="enrollment-info">
              <div className="enrollment-stats">
                <span className={`enrollment-count ${isFull ? 'full' : ''}`}>
                  {classData.enrolledUsers?.length || 0} / {classData.maxCapacity}
                </span>
                <span className="enrollment-label">
                  {isFull ? 'Clase Llena' : 'Cupos Disponibles'}
                </span>
              </div>
              <div className="enrollment-bar">
                <div 
                  className="enrollment-progress"
                  style={{ 
                    width: `${enrollmentPercentage}%`,
                    backgroundColor: isFull ? '#ef4444' : typeColor
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignees Section */}
        {classData.assignees && classData.assignees.length > 0 && (
          <div className="class-details-card">
            <h3>Miembros Inscritos</h3>
            <div className="assignees-list">
              {classData.assignees.map((assignee, index) => (
                <div key={index} className="assignee-item">
                  <div className="assignee-avatar">
                    {assignee.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="assignee-info">
                    <div className="assignee-name">{assignee.name}</div>
                    {assignee.email && (
                      <div className="assignee-email">{assignee.email}</div>
                    )}
                    {assignee.role && (
                      <div className="assignee-role">{assignee.role}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="class-details-card">
          <h3>Comentarios</h3>
          
          {/* Add Comment Form */}
          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="comment-form-header">
                <div className="comment-form-avatar">
                  {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <textarea
                  className="comment-input"
                  placeholder="Agregar un comentario..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>
              {commentError && (
                <div className="comment-error">{commentError}</div>
              )}
              <div className="comment-form-actions">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting || !commentText.trim()}
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Comentario'}
                </Button>
              </div>
            </form>
          )}

          {/* Comments List */}
          {classData.comments && classData.comments.length > 0 ? (
            <div className="comments-list">
              {classData.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-avatar">
                      {comment.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="comment-meta">
                      <span className="comment-author">{comment.name}</span>
                      <span className="comment-date">
                        {formatCommentDate(comment.date)}
                      </span>
                    </div>
                  </div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
