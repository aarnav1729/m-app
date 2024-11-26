// frontend/src/components/Manager/AssignPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignPage = () => {
    const [pmPlans, setPmPlans] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pmPlansRes = await axios.get('http://localhost:5000/api/manager/pm-plans', {
                    headers: { username: 'manager1' } // Replace with actual username
                });
                if (pmPlansRes.data.success) {
                    setPmPlans(pmPlansRes.data.data);
                }

                const engineersRes = await axios.get('http://localhost:5000/api/manager/engineers', {
                    headers: { username: 'manager1' } // Replace with actual username
                });
                if (engineersRes.data.success) {
                    setEngineers(engineersRes.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleAssignChange = (task_id, engineer_id) => {
        setAssignments(prevState => ({
            ...prevState,
            [task_id]: engineer_id
        }));
    };

    const handleAssign = async () => {
        try {
            const assignPromises = Object.entries(assignments).map(([task_id, engineer_id]) => {
                return axios.post('http://localhost:5000/api/manager/assign', { task_id, engineer_id, comments: '' }, {
                    headers: { username: 'manager1' } // Replace with actual username
                });
            });
            await Promise.all(assignPromises);
            setMessage('Engineers assigned successfully');
            // Refresh PM Plans
            const pmPlansRes = await axios.get('http://localhost:5000/api/manager/pm-plans', {
                headers: { username: 'manager1' } // Replace with actual username
            });
            if (pmPlansRes.data.success) {
                setPmPlans(pmPlansRes.data.data);
            }
            setAssignments({});
        } catch (err) {
            console.error(err);
            setMessage('Failed to assign engineers');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Manager - Assign Engineers</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Task ID</th>
                        <th>Month</th>
                        <th>Company</th>
                        <th>Machine Type</th>
                        <th>Machine Number</th>
                        <th>Planned Completion Date</th>
                        <th>Assign Engineer</th>
                    </tr>
                </thead>
                <tbody>
                    {pmPlans.map(task => (
                        <tr key={task.task_id} className="text-center border-t">
                            <td className="py-2">{task.task_id}</td>
                            <td>{task.month}</td>
                            <td>{task.company_code}</td>
                            <td>{task.machine_type}</td>
                            <td>{task.machine_number}</td>
                            <td>{new Date(task.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</td>
                            <td>
                                <select
                                    value={assignments[task.task_id] || ''}
                                    onChange={(e) => handleAssignChange(task.task_id, e.target.value)}
                                    className="px-2 py-1 border rounded"
                                >
                                    <option value="">Select Engineer</option>
                                    {engineers.map(engineer => (
                                        <option key={engineer.id} value={engineer.id}>{engineer.name}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleAssign} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Assign Engineers
            </button>
        </div>
    );
};

export default AssignPage;