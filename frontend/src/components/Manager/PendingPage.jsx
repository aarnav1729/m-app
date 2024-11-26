// frontend/src/components/Manager/PendingPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingPage = () => {
    const [pendingTasks, setPendingTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deviationForm, setDeviationForm] = useState({
        serial_number: '',
        machine_type: '',
        machine_number: '',
        planned_date: '',
        updated_date: '',
        reason: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPendingTasks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/manager/pending-tasks', {
                    headers: { username: 'manager1' } // Replace with actual username
                });
                if (res.data.success) {
                    setPendingTasks(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPendingTasks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/manager/submit-deviation', {
                task_id: selectedTask.task_id,
                updated_date: deviationForm.updated_date,
                reason: deviationForm.reason
            }, {
                headers: { username: 'manager1' } // Replace with actual username
            });
            if (res.data.success) {
                setMessage('Deviation form submitted successfully');
                // Refresh pending tasks
                const fetchPendingTasks = await axios.get('http://localhost:5000/api/manager/pending-tasks', {
                    headers: { username: 'manager1' } // Replace with actual username
                });
                if (fetchPendingTasks.data.success) {
                    setPendingTasks(fetchPendingTasks.data.data);
                }
                setSelectedTask(null);
                setDeviationForm({
                    serial_number: '',
                    machine_type: '',
                    machine_number: '',
                    planned_date: '',
                    updated_date: '',
                    reason: ''
                });
            } else {
                setMessage('Failed to submit deviation form');
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error');
        }
    };

    const selectTask = (task) => {
        setSelectedTask(task);
        setDeviationForm({
            serial_number: task.serial_number,
            machine_type: task.machine_type,
            machine_number: task.machine_number,
            planned_date: task.planned_completion_date,
            updated_date: '',
            reason: ''
        });
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Manager - Pending Tasks</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Task ID</th>
                        <th>Machine Type</th>
                        <th>Machine Number</th>
                        <th>Planned Completion Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingTasks.map(task => (
                        <tr key={task.task_id} className="text-center border-t">
                            <td className="py-2">{task.task_id}</td>
                            <td>{task.machine_type}</td>
                            <td>{task.machine_number}</td>
                            <td>{new Date(task.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</td>
                            <td>
                                <button onClick={() => selectTask(task)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                                    Submit Deviation
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTask && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-2xl mb-4">Submit Deviation Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Serial Number</label>
                            <input
                                type="text"
                                name="serial_number"
                                value={deviationForm.serial_number}
                                readOnly
                                className="w-full px-3 py-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Machine Type</label>
                            <input
                                type="text"
                                name="machine_type"
                                value={deviationForm.machine_type}
                                readOnly
                                className="w-full px-3 py-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Machine Number</label>
                            <input
                                type="text"
                                name="machine_number"
                                value={deviationForm.machine_number}
                                readOnly
                                className="w-full px-3 py-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Planned Date</label>
                            <input
                                type="date"
                                name="planned_date"
                                value={new Date(deviationForm.planned_date).toISOString().split('T')[0]}
                                readOnly
                                className="w-full px-3 py-2 border rounded bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Updated Date</label>
                            <input
                                type="date"
                                name="updated_date"
                                value={deviationForm.updated_date}
                                onChange={(e) => setDeviationForm({ ...deviationForm, updated_date: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Reason</label>
                            <textarea
                                name="reason"
                                value={deviationForm.reason}
                                onChange={(e) => setDeviationForm({ ...deviationForm, reason: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Submit Deviation Form
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PendingPage;