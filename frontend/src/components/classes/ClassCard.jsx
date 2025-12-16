import { useNavigate } from 'react-router-dom';
import { CLASS_TYPE_COLORS, STATUS_COLORS } from '../../utils/constants';
import Button from '../common/Button';
import './ClassCard.css';

const ClassCard = ({ classData, onEdit, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/classes/${classData._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent card click when clicking edit button
    if (onEdit) {
      onEdit(classData);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete button
    if (onDelete) {
      onDelete(classData._id);
    }
  };

  const handleStatusChange = (e) => {
    e.stopPropagation(); // Prevent card click
    const newStatus = e.target.value;
    if (newStatus && newStatus !== classData.status && onStatusChange) {
      onStatusChange(classData._id, newStatus);
    }
  };

  const formatDate = (date) => {
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

  return (
    <div 
      className="class-card" 
      onClick={handleClick}
      style={{ borderLeftColor: typeColor }}
    >
      <div className="class-card-header">
        <h3 className="class-card-title">{classData.title}</h3>
      </div>

      <div className="class-card-type" style={{ color: typeColor }}>
        {classData.type}
      </div>

      <div className="class-card-status-container">
        {onStatusChange ? (
          <select
            className="class-card-status-select"
            value={classData.status}
            onChange={handleStatusChange}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: statusColor }}
          >
            <option value="Programada">Programada</option>
            <option value="En Curso">En Curso</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        ) : (
          <span 
            className="class-card-status"
            style={{ backgroundColor: statusColor }}
          >
            {classData.status}
          </span>
        )}
      </div>

      <div className="class-card-info">
        <div className="class-card-instructor">
          <span className="label">Instructor:</span>
          <span>{classData.instructor}</span>
        </div>

        <div className="class-card-dates">
          <div>
            <span className="label">Inicio:</span>
            <span>{formatDate(classData.startDate)}</span>
          </div>
          <div>
            <span className="label">Fin:</span>
            <span>{formatDate(classData.endDate)}</span>
          </div>
        </div>

        <div className="class-card-enrollment">
          <span className="label">Inscripción:</span>
          <span className={classData.assignees?.length >= classData.maxCapacity ? 'full' : ''}>
            {classData.assignees?.length || 0} / {classData.maxCapacity}
          </span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="class-card-actions">
          {onEdit && (
            <Button
              variant="secondary"
              onClick={handleEdit}
              className="class-card-edit-btn"
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              onClick={handleDelete}
              className="class-card-delete-btn"
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassCard;
