// frontend/src/components/Admin/SummaryPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const SummaryPage = () => {
    const { auth } = useContext(AuthContext);
    const [summary, setSummary] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/summary');
                if (res.data.success) {
                    setSummary(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchSummary();
    }, []);

    const handleClick = (task) => {
        setSelectedTask(task);
        setReason(task.reason || 'No reason provided');
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Admin Summary Page</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">PM Plan ID</th>
                        <th>Month</th>
                        <th>Company</th>
                        <th>Machine Type</th>
                        <th>Task ID</th>
                        <th>Planned Completion Date</th>
                        <th>Status</th>
                        <th>Engineer</th>
                        <th>Deviation Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {summary.map((task) => (
                        <tr key={task.task_id} className="text-center border-t">
                            <td className="py-2">{task.pm_plan_id}</td>
                            <td>{task.month}</td>
                            <td>{task.company_code}</td>
                            <td>{task.machine_type}</td>
                            <td>{task.task_id}</td>
                            <td>{new Date(task.planned_completion_date).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' })}</td>
                            <td>
                                {task.status}
                                {task.status !== 'completed' && (
                                    <button
                                        onClick={() => handleClick(task)}
                                        className="ml-2 text-blue-500 underline"
                                    >
                                        View Reason
                                    </button>
                                )}
                            </td>
                            <td>{task.engineer}</td>
                            <td>{task.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedTask && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h2 className="text-xl mb-2">Deviation Details</h2>
                    <p><strong>Task ID:</strong> {selectedTask.task_id}</p>
                    <p><strong>Reason:</strong> {reason}</p>
                    <p><strong>Submitted At:</strong> {new Date(selectedTask.submitted_at).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })}</p>
                    <p><strong>Engineer Assigned:</strong> {selectedTask.engineer}</p>
                    <p><strong>Deviation Approved By:</strong> {selectedTask.deviation_approved_by || 'Pending'}</p>
                </div>
            )}
        </div>
    );
};

export default SummaryPage;