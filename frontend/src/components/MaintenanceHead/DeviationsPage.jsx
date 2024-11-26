// frontend/src/components/MaintenanceHead/DeviationsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeviationsPage = () => {
    const [deviationForms, setDeviationForms] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDeviationForms = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/maintenance-head/deviations', {
                    headers: { username: 'mainthead1' } // Replace with actual username
                });
                if (res.data.success) {
                    setDeviationForms(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDeviationForms();
    }, []);

    const handleAction = async (form_id, action) => {
        try {
            const res = await axios.post('http://localhost:5000/api/maintenance-head/deviations', {
                id: form_id,
                action: action,
                approved_by_manager_id: 1 // Replace with actual manager ID from auth
            }, {
                headers: { username: 'mainthead1' } // Replace with actual username
            });
            if (res.data.success) {
                // Refresh the list
                setDeviationForms(deviationForms.filter(form => form.id !== form_id));
                setMessage(`Deviation form ${action}d successfully`);
            }
        } catch (err) {
            console.error(err);
            setMessage(`Failed to ${action} deviation form`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Maintenance Head - Deviation Forms</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Form ID</th>
                        <th>Task ID</th>
                        <th>Reason</th>
                        <th>Submitted At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deviationForms.map(form => (
                        <tr key={form.id} className="text-center border-t">
                            <td className="py-2">{form.id}</td>
                            <td>{form.task_id}</td>
                            <td>{form.reason}</td>
                            <td>{new Date(form.submitted_at).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })}</td>
                            <td>
                                <button
                                    onClick={() => handleAction(form.id, 'approve')}
                                    className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(form.id, 'decline')}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Decline
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeviationsPage;