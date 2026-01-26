import { useEffect, useState } from 'react';
import { getUsers, addUser, deleteUser } from '../../services/admin.service';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'SECRETARY', name: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
        const data = await getUsers();
        setUsers(data);
    } catch (err) {
        console.error(err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addUser(newUser);
        setNewUser({ username: '', email: '', password: '', role: 'SECRETARY', name: '' });
        loadUsers();
    } catch (err) {
        alert('Failed to add user');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
        await deleteUser(id);
        loadUsers();
    }
  };

  return (
    <div>
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="bg-white p-6 rounded shadow mb-8">
            <h2 className="text-lg font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="border p-2 rounded" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                <input type="text" placeholder="Username" className="border p-2 rounded" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} required />
                <input type="email" placeholder="Email" className="border p-2 rounded" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                <input type="password" placeholder="Password" className="border p-2 rounded" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                <select className="border p-2 rounded" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                    <option value="SECRETARY">Secretary</option>
                    <option value="ADVOCATE">Advocate</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <button className="bg-blue-600 text-white py-2 rounded">Create User</button>
            </form>
        </div>

        <div className="bg-white rounded shadow">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="px-6 py-4">{u.name}</td>
                            <td className="px-6 py-4">{u.role}</td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default UserManagement;
