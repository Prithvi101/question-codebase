import React, { useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const MOCK_API_USERS: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Developer' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'Designer' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Manager' }
];

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchUsers = () => {
      // Simulate API response
      setUsers(MOCK_API_USERS);
    };
    fetchUsers();
    // BUG: Including 'users' in the dependencies creates an infinite render loop.
  }, [users]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditEmail(user.email);
    setValidationError('');
  };

  const handleSave = () => {
    // BUG: Fails to validate email format, allowing any string to be saved.
    // We should validate that email includes '@' and '.'
    setUsers(
      users.map((u) =>
        u.id === selectedUser?.id ? { ...u, email: editEmail } : u
      )
    );
    setSelectedUser(null);
  };

  // BUG: Case-sensitive comparison makes search queries like 'alice' fail.
  const filteredUsers = users.filter((user) =>
    user.name.includes(searchQuery)
  );

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h1>User Directory</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: 10, fontSize: 16, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ flex: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
                <th style={{ padding: 10 }}>Name</th>
                <th style={{ padding: 10 }}>Email</th>
                <th style={{ padding: 10 }}>Role</th>
                <th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>{user.name}</td>
                  <td style={{ padding: 10 }}>{user.email}</td>
                  <td style={{ padding: 10 }}>{user.role}</td>
                  <td style={{ padding: 10 }}>
                    <button onClick={() => handleEditClick(user)}>Edit Email</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* BUG: Fails to show an empty state when search returns no users. */}
        </div>

        {selectedUser && (
          <div style={{ flex: 1, border: '1px solid #ccc', padding: 20, borderRadius: 8, background: '#fafafa', height: 'fit-content' }}>
            <h3>Edit Email for {selectedUser.name}</h3>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Email:</label>
              <input
                type="text"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
              />
              {validationError && (
                <span className="error-msg" style={{ color: 'red', fontSize: 13, marginTop: 5, display: 'block' }}>
                  {validationError}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} style={{ padding: '8px 12px', background: 'green', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Save
              </button>
              <button onClick={() => setSelectedUser(null)} style={{ padding: '8px 12px', background: '#ccc', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
