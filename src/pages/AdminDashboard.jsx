import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import { useAuth } from '../contexts/AuthContext';

import {
  getAllUsers,
  updateUser,
  deleteUser
} from '../services/authService';

import Navbar from '../components/common/Navbar';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityLog from '../components/dashboard/ActivityLog';
import UserTable from '../components/dashboard/UserTable';

import {
  Users,
  UserCheck,
  Shield,
  Activity,
  X
} from 'lucide-react';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {

  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [deleteConfirm, setDeleteConfirm] =
    useState(null);

  const [message, setMessage] = useState({
    type: '',
    text: ''
  });

  const [leaveRequests, setLeaveRequests] =
    useState([]);

  
  const [
    announcementTitle,
    setAnnouncementTitle
  ] = useState('');

  const [
    announcementMessage,
    setAnnouncementMessage
  ] = useState('');

  const [
    announcements,
    setAnnouncements
  ] = useState([]);

  const loadUsers = useCallback(() => {
    setUsers(getAllUsers());
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  
  useEffect(() => {

    const storedLeaves =
      JSON.parse(
        localStorage.getItem('leaveRequests')
      ) || [];

    setLeaveRequests(storedLeaves);

  }, []);


  useEffect(() => {

    const storedAnnouncements =
      JSON.parse(
        localStorage.getItem('announcements')
      ) || [];

    setAnnouncements(storedAnnouncements);

  }, []);

  const stats = {
    total: users.length,
    active: users.filter(
      u => u.status === 'active'
    ).length,

    admins: users.filter(
      u => u.role === 'admin'
    ).length,

    employees: users.filter(
      u => u.role === 'employee'
    ).length
  };


  const chartData = [
    {
      name: 'Admins',
      users: stats.admins
    },
    {
      name: 'Employees',
      users: stats.employees
    }
  ];

  const pieData = [
    {
      name: 'Active',
      value: stats.active
    },
    {
      name: 'Inactive',
      value:
        stats.total - stats.active
    }
  ];

  const COLORS = [
    '#4f46e5',
    '#ef4444'
  ];

  const handleEdit = (userToEdit) => {

    setEditingUser({
      ...userToEdit
    });

    setShowModal(true);
  };

  const handleDelete = async (
    userToDelete
  ) => {

    if (
      deleteConfirm?.id ===
      userToDelete.id
    ) {

      try {

        deleteUser(userToDelete.id);

        loadUsers();

        setMessage({
          type: 'success',
          text:
            'User deleted successfully'
        });

        setDeleteConfirm(null);

      } catch (err) {

        setMessage({
          type: 'error',
          text: err.message
        });

      }

    } else {

      setDeleteConfirm(userToDelete);

    }
  };

  const handleSave = async (e) => {

    e.preventDefault();

    try {

      await updateUser(
        editingUser.id,
        {
          name: editingUser.name,
          department:
            editingUser.department,
          role: editingUser.role,
          status:
            editingUser.status
        }
      );

      loadUsers();

      setShowModal(false);

      setEditingUser(null);

      setMessage({
        type: 'success',
        text:
          'User updated successfully'
      });

    } catch (err) {

      setMessage({
        type: 'error',
        text: err.message
      });

    }
  };


  const handleLeaveAction = (
    id,
    action
  ) => {

    const updatedLeaves =
      leaveRequests.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status: action
            }
          : leave
      );

    setLeaveRequests(updatedLeaves);

    localStorage.setItem(
      'leaveRequests',
      JSON.stringify(updatedLeaves)
    );
  };


  useEffect(() => {

    if (message.text) {

      const timer = setTimeout(() => {

        setMessage({
          type: '',
          text: ''
        });

      }, 4000);

      return () => clearTimeout(timer);

    }

  }, [message]);


  const handleAnnouncementSubmit = (
    e
  ) => {

    e.preventDefault();

    const newAnnouncement = {
      id: Date.now(),
      title: announcementTitle,
      message:
        announcementMessage,
      date:
        new Date().toLocaleDateString()
    };

    const updatedAnnouncements = [
      newAnnouncement,
      ...announcements
    ];

    setAnnouncements(
      updatedAnnouncements
    );

    localStorage.setItem(
      'announcements',
      JSON.stringify(
        updatedAnnouncements
      )
    );

    setAnnouncementTitle('');
    setAnnouncementMessage('');

    setMessage({
      type: 'success',
      text:
        'Announcement published successfully'
    });
  };

  return (
    <>
      <Navbar />

      <main className="dashboard">

        <header className="dashboard-header">

          <h1 className="dashboard-title">
            Admin Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage users and monitor
            system activity
          </p>

        </header>

        {message.text && (

          <div
            className={`alert alert-${message.type}`}
            style={{
              marginBottom: '1.5rem'
            }}
          >
            {message.text}
          </div>

        )}

  
        <div className="stats-grid">

          <StatsCard
            icon={Users}
            value={stats.total}
            label="Total Users"
            variant="primary"
          />

          <StatsCard
            icon={UserCheck}
            value={stats.active}
            label="Active Users"
            variant="success"
          />

          <StatsCard
            icon={Shield}
            value={stats.admins}
            label="Administrators"
            variant="warning"
          />

          <StatsCard
            icon={Activity}
            value={stats.employees}
            label="Employees"
            variant="primary"
          />

        </div>

      
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}
        >

     
          <div className="card">

            <div className="card-header">
              <h2 className="card-title">
                User Analytics
              </h2>
            </div>

            <div
              className="card-body"
              style={{ height: '300px' }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={chartData}>

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="users"
                    fill="#4f46e5"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

     
          <div className="card">

            <div className="card-header">
              <h2 className="card-title">
                Account Status
              </h2>
            </div>

            <div
              className="card-body"
              style={{ height: '300px' }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >

                    {pieData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

       
        <div
          className="card"
          style={{
            marginBottom: '1.5rem'
          }}
        >

          <div className="card-header">

            <h2 className="card-title">
              User Management
            </h2>

          </div>

          <div
            className="card-body"
            style={{ padding: 0 }}
          >

            <UserTable
              users={users}
              currentUserId={user.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          </div>

        </div>

       
        <div
          className="card"
          style={{
            marginBottom: '1.5rem'
          }}
        >

          <div className="card-header">

            <h2 className="card-title">
              Leave Requests
            </h2>

          </div>

          <div className="card-body">

            {leaveRequests.length === 0 ? (

              <p>
                No leave requests found
              </p>

            ) : (

              leaveRequests.map((leave) => (

                <div
                  key={leave.id}
                  style={{
                    border:
                      '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}
                >

                  <h3>
                    {leave.employee}
                  </h3>

                  <p>
                    <strong>
                      Date:
                    </strong>{' '}
                    {leave.date}
                  </p>

                  <p>
                    <strong>
                      Reason:
                    </strong>{' '}
                    {leave.reason}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{' '}
                    {leave.status}
                  </p>

                  {leave.status ===
                    'Pending' && (

                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem'
                      }}
                    >

                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleLeaveAction(
                            leave.id,
                            'Accepted'
                          )
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleLeaveAction(
                            leave.id,
                            'Declined'
                          )
                        }
                      >
                        Decline
                      </button>

                    </div>

                  )}

                </div>

              ))

            )}

          </div>

        </div>

        
        <div
          className="card"
          style={{
            marginBottom: '1.5rem'
          }}
        >

          <div className="card-header">

            <h2 className="card-title">
              Company Announcements
            </h2>

          </div>

          <div className="card-body">

            <form
              onSubmit={
                handleAnnouncementSubmit
              }
              style={{
                display: 'grid',
                gap: '1rem',
                marginBottom: '2rem'
              }}
            >

              <input
                type="text"
                className="form-input"
                placeholder="Announcement Title"
                value={announcementTitle}
                onChange={(e) =>
                  setAnnouncementTitle(
                    e.target.value
                  )
                }
                required
              />

              <textarea
                rows="4"
                className="form-input"
                placeholder="Announcement Message"
                value={announcementMessage}
                onChange={(e) =>
                  setAnnouncementMessage(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="submit"
                className="btn btn-primary"
              >
                Publish Announcement
              </button>

            </form>

            <div
              style={{
                display: 'grid',
                gap: '1rem'
              }}
            >

              {announcements.length === 0 ? (

                <p>
                  No announcements
                  available
                </p>

              ) : (

                announcements.map(
                  (item) => (

                    <div
                      key={item.id}
                      style={{
                        border:
                          '1px solid var(--border)',
                        borderRadius:
                          '10px',
                        padding: '1rem',
                        background:
                          'var(--background)'
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          marginBottom:
                            '0.5rem'
                        }}
                      >

                        <h3
                          style={{
                            fontWeight:
                              '600'
                          }}
                        >
                          {item.title}
                        </h3>

                        <span
                          style={{
                            fontSize:
                              '0.8rem',
                            color:
                              'var(--text-secondary)'
                          }}
                        >
                          {item.date}
                        </span>

                      </div>

                      <p>
                        {item.message}
                      </p>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>

      
        {deleteConfirm && (

          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform:
                'translateX(-50%)',
              background:
                'var(--surface)',
              padding: '1rem 1.5rem',
              borderRadius:
                'var(--radius-lg)',
              boxShadow:
                'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              zIndex: 1000
            }}
          >

            <span>
              Delete{' '}
              <strong>
                {deleteConfirm.name}
              </strong>
              ?
            </span>

            <button
              className="btn btn-danger"
              onClick={() =>
                handleDelete(
                  deleteConfirm
                )
              }
            >
              Confirm
            </button>

            <button
              className="btn btn-secondary"
              onClick={() =>
                setDeleteConfirm(null)
              }
            >
              Cancel
            </button>

          </div>

        )}

    
        <div className="card">

          <div className="card-header">

            <h2 className="card-title">
              System Activity Log
            </h2>

          </div>

          <div
            className="card-body"
            style={{
              padding:
                '0.5rem 1rem'
            }}
          >

            <ActivityLog limit={15} />

          </div>

        </div>


        {showModal &&
          editingUser && (

          <div
            style={{
              position: 'fixed',
              inset: 0,
              background:
                'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >

            <div
              style={{
                background:
                  'var(--surface)',
                borderRadius:
                  'var(--radius-lg)',
                width: '100%',
                maxWidth: '480px',
                maxHeight: '90vh',
                overflow: 'auto'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems:
                    'center',
                  padding:
                    '1.25rem 1.5rem',
                  borderBottom:
                    '1px solid var(--border)'
                }}
              >

                <h3
                  style={{
                    fontWeight: 600
                  }}
                >
                  Edit User
                </h3>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(
                      null
                    );
                  }}
                  style={{
                    background:
                      'none',
                    border: 'none',
                    cursor:
                      'pointer',
                    color:
                      'var(--text-secondary)'
                  }}
                >
                  <X size={24} />
                </button>

              </div>

              <form
                onSubmit={handleSave}
                style={{
                  padding: '1.5rem'
                }}
              >

                <div className="form-group">

                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-input"
                    value={
                      editingUser.name
                    }
                    onChange={(e) =>
                      setEditingUser(
                        (prev) => ({
                          ...prev,
                          name:
                            e.target.value
                        })
                      )
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-input"
                    value={
                      editingUser.email
                    }
                    disabled
                  />

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Department
                  </label>

                  <select
                    className="form-input"
                    value={
                      editingUser.department
                    }
                    onChange={(e) =>
                      setEditingUser(
                        (prev) => ({
                          ...prev,
                          department:
                            e.target.value
                        })
                      )
                    }
                  >

                    {[
                      'Engineering',
                      'Marketing',
                      'Sales',
                      'HR',
                      'Finance',
                      'Operations',
                      'IT',
                      'General'
                    ].map((d) => (

                      <option
                        key={d}
                        value={d}
                      >
                        {d}
                      </option>

                    ))}

                  </select>

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Role
                  </label>

                  <select
                    className="form-input"
                    value={
                      editingUser.role
                    }
                    onChange={(e) =>
                      setEditingUser(
                        (prev) => ({
                          ...prev,
                          role:
                            e.target.value
                        })
                      )
                    }
                    disabled={
                      editingUser.id ===
                      user.id
                    }
                  >

                    <option value="employee">
                      Employee
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label className="form-label">
                    Status
                  </label>

                  <select
                    className="form-input"
                    value={
                      editingUser.status
                    }
                    onChange={(e) =>
                      setEditingUser(
                        (prev) => ({
                          ...prev,
                          status:
                            e.target.value
                        })
                      )
                    }
                    disabled={
                      editingUser.id ===
                      user.id
                    }
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>

                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop:
                      '1.5rem'
                  }}
                >

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      flex: 1
                    }}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(
                        false
                      );

                      setEditingUser(
                        null
                      );
                    }}
                    style={{
                      flex: 1
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>
    </>
  );
};

export default AdminDashboard;