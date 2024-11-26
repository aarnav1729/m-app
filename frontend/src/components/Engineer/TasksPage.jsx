// frontend/src/components/Engineer/TaskPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [checkpointsStatus, setCheckpointsStatus] = useState({});
    const [proofImage, setProofImage] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/engineer/tasks', {
                    headers: { username: 'engineer_aarnav' } // Replace with actual username
                });
                if (res.data.success) {
                    setTasks(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);

    const selectTask = async (task_id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/engineer/tasks/${task_id}`, {
                headers: { username: 'engineer_aarnav' } // Replace with actual username
            });
            if (res.data.success) {
                setSelectedTask(res.data.task);
                // Initialize checkpoints status
                const initialStatus = {};
                res.data.checkpoints.forEach(cp => {
                    initialStatus[cp.id] = false;
                });
                setCheckpointsStatus(initialStatus);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckpointChange = (checkpoint_id) => {
        setCheckpointsStatus(prevState => ({
            ...prevState,
            [checkpoint_id]: !prevState[checkpoint_id]
        }));
    };

    const handleProofImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProofImage(e.target.files[0]);
        }
    };

    const handleCompleteTask = async () => {
        // Check if all checkpoints are marked as complete
        const allComplete = Object.values(checkpointsStatus).every(status => status === true);
        if (!allComplete) {
            setMessage('Please mark all checkpoints as complete');
            return;
        }

        if (!proofImage) {
            setMessage('Please upload proof image');
            return;
        }

        // Upload image to a storage service or handle as needed
        // For simplicity, assume the image URL is obtained after upload
        const proofImageUrl = URL.createObjectURL(proofImage); // Temporary URL, replace with actual upload

        try {
            // Submit proof image
            await axios.post('http://localhost:5000/api/engineer/tasks/submit-proof', {
                task_id: selectedTask.task_id,
                proof_image_url: proofImageUrl
            }, {
                headers: { username: 'engineer_aarnav' } // Replace with actual username
            });

            // Mark task as completed
            await axios.post('http://localhost:5000/api/engineer/tasks/complete', {
                task_id: selectedTask.task_id
            }, {
                headers: { username: 'engineer_aarnav' } // Replace with actual username
            });

            setMessage('Task marked as completed and proof submitted');
            setSelectedTask(null);
            setCheckpointsStatus({});
            setProofImage(null);
            // Refresh tasks
            const res = await axios.get('http://localhost:5000/api/engineer/tasks', {
                headers: { username: 'engineer_aarnav' } // Replace with actual username
            });
            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setMessage('Failed to complete task');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Engineer - My Tasks</h1>
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
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.task_id} className="text-center border-t">
                            <td className="py-2">{task.task_id}</td>
                            <td>{task.month}</td>
                            <td>{task.company_code}</td>
                            <td>{task.machine_type}</td>
                            <td>{task.machine_number}</td>
                            <td>{new Date(task.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</td>
                            <td>{task.status}</td>
                            <td>
                                {task.status !== 'completed' && (
                                    <button onClick={() => selectTask(task.task_id)} className="bg-blue-500 text-white px-2 py-1 rounded">
                                        View Task
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTask && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h2 className="text-2xl mb-4">Task Details</h2>
                    <p><strong>Task ID:</strong> {selectedTask.task_id}</p>
                    <p><strong>Machine Type:</strong> {selectedTask.machine_type}</p>
                    <p><strong>Machine Number:</strong> {selectedTask.machine_number}</p>
                    <p><strong>Planned Completion Date:</strong> {new Date(selectedTask.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</p>
                    <h3 className="text-xl mt-4 mb-2">Checkpoints</h3>
                    <ul className="list-disc list-inside">
                        {selectedTask.checkpoints.map(cp => (
                            <li key={cp.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={checkpointsStatus[cp.id] || false}
                                    onChange={() => handleCheckpointChange(cp.id)}
                                    className="mr-2"
                                />
                                {cp.checkpoints}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                        <label className="block text-gray-700">Proof Image</label>
                        <input type="file" accept="image/*" onChange={handleProofImageChange} className="mt-2" required />
                        {proofImage && <img src={URL.createObjectURL(proofImage)} alt="Proof" className="w-32 h-32 object-cover mt-2" />}
                    </div>
                    <button onClick={handleCompleteTask} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                        Mark Task as Completed
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskPage;