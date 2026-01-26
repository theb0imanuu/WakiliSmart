import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            authLogin(data.access_token, { username: data.username, role: data.role });
            if (data.role === 'ADMIN' || data.role === 'ADVOCATE') {
                navigate('/admin');
            } else {
                navigate('/secretary');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm">Username/Email</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
