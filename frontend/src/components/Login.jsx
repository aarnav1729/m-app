// frontend/src/components/Login.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
            if (res.data.success) {
                setAuth({
                    isAuthenticated: true,
                    role: res.data.role,
                    username: res.data.username
                });
                // Redirect based on role
                switch (res.data.role) {
                    case 'admin':
                        navigate('/admin/summary');
                        break;
                    case 'maintenance_head':
                        navigate('/maintenance-head/plan');
                        break;
                    case 'manager':
                        navigate('/manager/assign');
                        break;
                    case 'engineer':
                        navigate('/engineer/tasks');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.error(err);
            setError('Server error');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl mb-4">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;