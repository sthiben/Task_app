import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import statsService from '../services/statsService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classDashboard, setClassDashboard] = useState(null);
  const [userDashboard, setUserDashboard] = useState(null);
  const [popularClasses, setPopularClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/classes');
      return;
    }

    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classData, userData, popular] = await Promise.all([
        statsService.getClassDashboard(),
        statsService.getUserDashboard(),
        statsService.getPopularClasses()
      ]);

      setClassDashboard(classData);
      setUserDashboard(userData);
      setPopularClasses(popular);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await statsService.getAllUsers();
      setUsers(data.data || data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await statsService.deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Gestión y estadísticas del gimnasio</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-content">
          {/* Top Stats Grid */}
          <div className="top-stats-grid">
            <div className="stat-card">
              <h3>Total de Clases</h3>
              <p className="stat-value">
                {classDashboard?.totalClasses?.[0]?.count || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Próximas Clases</h3>
              <p className="stat-value">
                {classDashboard?.upcomingClasses?.[0]?.count || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Total de Usuarios</h3>
              <p className="stat-value">
                {userDashboard?.totalUsers?.[0]?.count || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Usuarios Activos</h3>
              <p className="stat-value">
                {userDashboard?.activeUsers?.[0]?.count || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Promedio de Inscritos</h3>
              <p className="stat-value">
                {classDashboard?.avgEnrollment?.[0]?.avgEnrolled?.toFixed(1) || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Capacidad Promedio</h3>
              <p className="stat-value">
                {classDashboard?.avgEnrollment?.[0]?.avgCapacity?.toFixed(0) || 0}
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="two-column-layout">
            {/* Left Column */}
            <div className="column">
              <div className="stats-section">
                <h2>Estadísticas de Clases</h2>
                
                {/* Classes by Type */}
                <div className="chart-section">
                  <h3>Clases por Tipo</h3>
                  <div className="chart-list">
                    {classDashboard?.byType?.map((item) => (
                      <div key={item._id} className="chart-item">
                        <span className="chart-label">{item._id}</span>
                        <div className="chart-bar">
                          <div
                            className="chart-fill"
                            style={{ width: `${(item.count / classDashboard.totalClasses[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="chart-value">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Classes by Status */}
                <div className="chart-section">
                  <h3>Clases por Estado</h3>
                  <div className="chart-list">
                    {classDashboard?.byStatus?.map((item) => (
                      <div key={item._id} className="chart-item">
                        <span className="chart-label">{item._id}</span>
                        <div className="chart-bar">
                          <div
                            className="chart-fill"
                            style={{ width: `${(item.count / classDashboard.totalClasses[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="chart-value">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="column">
              <div className="stats-section">
                <h2>Estadísticas de Usuarios</h2>
                
                {/* Users by Membership */}
                <div className="chart-section">
                  <h3>Usuarios por Membresía</h3>
                  <div className="chart-list">
                    {userDashboard?.byMembership?.map((item) => (
                      <div key={item._id} className="chart-item">
                        <span className="chart-label">{item._id}</span>
                        <div className="chart-bar">
                          <div
                            className="chart-fill"
                            style={{ width: `${(item.count / userDashboard.totalUsers[0].count) * 100}%` }}
                          />
                        </div>
                        <span className="chart-value">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <h2>Clases Más Populares</h2>
                <div className="popular-classes">
                  {popularClasses.slice(0, 5).map((classData, index) => (
                    <div key={classData._id} className="popular-class-item">
                      <span className="rank">#{index + 1}</span>
                      <div className="class-info">
                        <h4>{classData.title}</h4>
                        <p>{classData.type} - {classData.instructor}</p>
                      </div>
                      <div className="class-stats">
                        <span>{classData.enrollmentCount} / {classData.maxCapacity}</span>
                        <span className="occupancy">{classData.occupancyRate?.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="dashboard-content">
          <div className="users-section">
            <h2>Gestión de Usuarios</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Membership</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge badge-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.membershipType}</td>
                      <td>
                        <span className={`badge badge-${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.role !== 'admin' && (
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
