// frontend/src/components/Manager/ApprovePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApprovePage = () => {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/manager/completed-tasks', {
                    headers: { username: 'manager1' } // Replace with actual username
                });
                if (res.data.success) {
                    setCompletedTasks(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCompletedTasks();
    }, []);

    const handleAction = async (task, action) => {
        try {
            const res = await axios.post('http://localhost:5000/api/manager/approve-task', {
                completed_task_id: task.completed_task_id,
                action: action,
                comment: comment
            }, {
                headers: { username: 'manager1' } // Replace with actual username
            });
            if (res.data.success) {
                setMessage(`Task ${action}ed successfully`);
                // Refresh completed tasks
                const fetchCompletedTasks = await axios.get('http://localhost:5000/api/manager/completed-tasks', {
                    headers: { username: 'manager1' } // Replace with actual username
                });
                if (fetchCompletedTasks.data.success) {
                    setCompletedTasks(fetchCompletedTasks.data.data);
                }
                setSelectedTask(null);
                setComment('');
            } else {
                setMessage(`Failed to ${action} task`);
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error');
        }
    };

    const selectTask = (task) => {
        setSelectedTask(task);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Manager - Approve Completed Tasks</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Completed Task ID</th>
                        <th>Task ID</th>
                        <th>Machine Type</th>
                        <th>Machine Number</th>
                        <th>Planned Date</th>
                        <th>Proof Image</th>
                        <th>Engineer</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {completedTasks.map(task => (
                        <tr key={task.completed_task_id} className="text-center border-t">
                            <td className="py-2">{task.completed_task_id}</td>
                            <td>{task.task_id}</td>
                            <td>{task.machine_type}</td>
                            <td>{task.machine_number}</td>
                            <td>{new Date(task.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</td>
                            <td>
                                {task.proof_image_url ? (
                                    <img src={task.proof_image_url} alt="Proof" className="w-16 h-16 object-cover" />
                                ) : (
                                    'No Image'
                                )}
                            </td>
                            <td>{task.engineer}</td>
                            <td>
                                <button onClick={() => selectTask(task)} className="bg-blue-500 text-white px-2 py-1 rounded">
                                    Review
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTask && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-2xl mb-4">Review Completed Task</h2>
                    <p><strong>Completed Task ID:</strong> {selectedTask.completed_task_id}</p>
                    <p><strong>Task ID:</strong> {selectedTask.task_id}</p>
                    <p><strong>Machine Type:</strong> {selectedTask.machine_type}</p>
                    <p><strong>Machine Number:</strong> {selectedTask.machine_number}</p>
                    <p><strong>Planned Date:</strong> {new Date(selectedTask.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</p>
                    <p><strong>Engineer:</strong> {selectedTask.engineer}</p>
                    <p><strong>Proof Image:</strong></p>
                    {selectedTask.proof_image_url ? (
                        <img src={selectedTask.proof_image_url} alt="Proof" className="w-32 h-32 object-cover mb-4" />
                    ) : (
                        <p>No Image</p>
                    )}
                    <div className="space-y-4">
                        <button
                            onClick={() => handleAction(selectedTask, 'confirm')}
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Confirm Completion
                        </button>
                        <button
                            onClick={() => handleAction(selectedTask, 'assign_back')}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Assign Back to Engineer
                        </button>
                        {selectedTask.status === 'assign_back' && (
                            <div className="mt-4">
                                <label className="block text-gray-700">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                ></textarea>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovePage;