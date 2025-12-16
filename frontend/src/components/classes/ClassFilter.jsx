import { CLASS_TYPES, CLASS_STATUSES } from '../../utils/constants';
import './ClassFilter.css';

const ClassFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const handleTypeChange = (type) => {
    onFilterChange({
      ...filters,
      type: filters.type === type ? '' : type
    });
  };

  const handleStatusChange = (status) => {
    onFilterChange({
      ...filters,
      status: filters.status === status ? '' : status
    });
  };

  const hasActiveFilters = filters.type || filters.status;

  return (
    <div className="class-filter">
      <div className="filter-section">
        <h3>Filtrar por Tipo</h3>
        <div className="filter-buttons">
          {CLASS_TYPES.map((type) => (
            <button
              key={type}
              className={`filter-btn ${filters.type === type ? 'active' : ''}`}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Filtrar por Estado</h3>
        <div className="filter-buttons">
          {CLASS_STATUSES.map((status) => (
            <button
              key={status}
              className={`filter-btn ${filters.status === status ? 'active' : ''}`}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-actions">
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassFilter;
