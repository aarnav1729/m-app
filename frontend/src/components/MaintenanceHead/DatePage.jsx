// frontend/src/components/MaintenanceHead/DatePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatePage = () => {
    const [pmPlans, setPmPlans] = useState([]);
    const [selectedPmPlanId, setSelectedPmPlanId] = useState('');
    const [duplicatedPlans, setDuplicatedPlans] = useState([]);
    const [plannedDates, setPlannedDates] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPmPlans = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/maintenance-head/pm-plans', {
                    headers: { username: 'mainthead1' } // Replace with actual username
                });
                if (res.data.success) {
                    setPmPlans(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPmPlans();
    }, []);

    const handleSelectPmPlan = async (e) => {
        const pm_plan_id = e.target.value;
        setSelectedPmPlanId(pm_plan_id);
        setDuplicatedPlans([]);
        setPlannedDates({});
        if (pm_plan_id) {
            try {
                // Call API to duplicate PM plans
                const res = await axios.post('http://localhost:5000/api/maintenance-head/duplicate-pm-plans', { pm_plan_id }, {
                    headers: { username: 'mainthead1' } // Replace with actual username
                });
                if (res.data.success) {
                    setMessage(res.data.message);
                    // Fetch duplicated plans, assuming the backend returns them
                    // For simplicity, refetch PM plans
                    const fetchPmPlans = await axios.get('http://localhost:5000/api/maintenance-head/pm-plans', {
                        headers: { username: 'mainthead1' } // Replace with actual username
                    });
                    if (fetchPmPlans.data.success) {
                        setPmPlans(fetchPmPlans.data.data);
                    }
                } else {
                    setMessage('Failed to duplicate PM Plans');
                }
            } catch (err) {
                console.error(err);
                setMessage('Server error');
            }
        }
    };

    const handleDateChange = (task_id, date) => {
        setPlannedDates(prevState => ({
            ...prevState,
            [task_id]: date
        }));
    };

    const handleAssignDates = async () => {
        try {
            const updates = Object.entries(plannedDates).map(([task_id, date]) => {
                return axios.post('http://localhost:5000/api/maintenance-head/assign-dates', {
                    task_id,
                    planned_completion_date: date
                }, {
                    headers: { username: 'mainthead1' } // Replace with actual username
                });
            });
            await Promise.all(updates);
            setMessage('Planned dates assigned successfully');
            // Reset selections
            setSelectedPmPlanId('');
            setDuplicatedPlans([]);
            setPlannedDates({});
            // Refresh PM Plans
            const fetchPmPlans = await axios.get('http://localhost:5000/api/maintenance-head/pm-plans', {
                headers: { username: 'mainthead1' } // Replace with actual username
            });
            if (fetchPmPlans.data.success) {
                setPmPlans(fetchPmPlans.data.data);
            }
        } catch (err) {
            console.error(err);
            setMessage('Failed to assign planned dates');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Maintenance Head - Assign Planned Dates</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <div className="mb-4">
                <label className="block text-gray-700">Select PM Plan to Duplicate</label>
                <select
                    value={selectedPmPlanId}
                    onChange={handleSelectPmPlan}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="">Select PM Plan</option>
                    {pmPlans.map(plan => (
                        <option key={plan.task_id} value={plan.task_id}>
                            PM Plan ID: {plan.pm_plan_id}, Month: {plan.month}, Company: {plan.company_code}, Machine Type: {plan.machine_type}, Machine Number: {plan.machine_number}
                        </option>
                    ))}
                </select>
            </div>

            {selectedPmPlanId && (
                <div>
                    <h2 className="text-2xl mb-4">Assign Planned Dates</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Task ID</th>
                                <th>Machine Type</th>
                                <th>Machine Number</th>
                                <th>Planned Completion Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pmPlans
                                .filter(plan => plan.task_id === parseInt(selectedPmPlanId))
                                .map(plan => (
                                    <tr key={plan.task_id} className="text-center border-t">
                                        <td className="py-2">{plan.task_id}</td>
                                        <td>{plan.machine_type}</td>
                                        <td>{plan.machine_number}</td>
                                        <td>
                                            <input
                                                type="date"
                                                value={plannedDates[plan.task_id] || ''}
                                                onChange={(e) => handleDateChange(plan.task_id, e.target.value)}
                                                className="px-2 py-1 border rounded"
                                                required
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <button onClick={handleAssignDates} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Assign Planned Dates
                    </button>
                </div>
            )}
        </div>
    );
};

export default DatePage;