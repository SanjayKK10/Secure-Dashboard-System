import React from 'react';
import { Trash2, Edit } from 'lucide-react';

const UserTable = ({ users, currentUserId, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ fontWeight: 500 }}>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
              </td>
              <td>
                <span className={`badge badge-${user.status}`}>{user.status}</span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onEdit(user)}
                    className="btn btn-secondary"
                    style={{ padding: '0.375rem 0.625rem' }}
                    title="Edit user"
                  >
                    <Edit size={16} />
                  </button>
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => onDelete(user)}
                      className="btn btn-danger"
                      style={{ padding: '0.375rem 0.625rem' }}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
