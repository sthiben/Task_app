import { useState, useEffect } from 'react';
import ClassList from '../components/classes/ClassList';
import ClassFilter from '../components/classes/ClassFilter';
import ClassForm from '../components/classes/ClassForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import classService from '../services/classService';
import { useAuth } from '../hooks/useAuth';
import './Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.response?.data?.message || 'No se pudieron cargar las clases');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: ''
    });
  };

  const handleCreateClass = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleEditClass = (classData) => {
    setSelectedClass(classData);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
      return;
    }

    try {
      await classService.deleteClass(classId);
      setSuccessMessage('¡Clase eliminada exitosamente!');
      
      // Refresh class list
      await fetchClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting class:', err);
      setError(err.message || 'Error al eliminar la clase');
    }
  };

  const handleStatusChange = async (classId, newStatus) => {
    try {
      await classService.updateClass(classId, { status: newStatus });
      setSuccessMessage(`¡Estado de la clase actualizado a ${newStatus}!`);
      
      // Refresh class list
      await fetchClasses();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating class status:', err);
      setError(err.message || 'Error al actualizar el estado de la clase');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClass(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedClass) {
        // Update existing class
        await classService.updateClass(selectedClass._id, formData);
        setSuccessMessage('¡Clase actualizada exitosamente!');
      } else {
        // Create new class
        await classService.createClass(formData);
        setSuccessMessage('¡Clase creada exitosamente!');
      }
      
      // Refresh class list
      await fetchClasses();
      
      // Close modal
      handleCloseModal();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving class:', err);
      throw err; // Re-throw to let ClassForm handle the error display
    }
  };

  // Filter classes based on active filters
  const filteredClasses = classes.filter((classData) => {
    if (filters.type && classData.type !== filters.type) {
      return false;
    }
    if (filters.status && classData.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="classes-page">
      <div className="classes-container">
        <div className="classes-header">
          <div className="header-content">
            <div>
              <h1>Clases Disponibles</h1>
              <p>Explora y selecciona las clases que mejor se adapten a tus objetivos</p>
            </div>
            {user?.role === 'admin' && (
              <Button 
                variant="primary" 
                onClick={handleCreateClass}
              >
                + Crear Clase
              </Button>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <ClassFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        
        <ClassList 
          classes={filteredClasses} 
          loading={loading} 
          error={error}
          onEdit={user?.role === 'admin' ? handleEditClass : null}
          onDelete={user?.role === 'admin' ? handleDeleteClass : null}
          onStatusChange={user?.role === 'admin' ? handleStatusChange : null}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedClass ? 'Editar Clase' : 'Crear Nueva Clase'}
      >
        <ClassForm
          classData={selectedClass}
          userId={user?._id}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Classes;
