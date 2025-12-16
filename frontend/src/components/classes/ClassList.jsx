import ClassCard from './ClassCard';
import './ClassList.css';

const ClassList = ({ classes, loading, error, onEdit, onDelete, onStatusChange }) => {
  if (loading) {
    return (
      <div className="class-list-loading">
        <div className="loader"></div>
        <p>Cargando clases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="class-list-error">
        <p>Error al cargar las clases: {error}</p>
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="class-list-empty">
        <p>No hay clases disponibles</p>
      </div>
    );
  }

  return (
    <div className="class-list">
      {classes.map((classData) => (
        <ClassCard 
          key={classData._id} 
          classData={classData}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ClassList;
