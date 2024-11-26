// frontend/src/components/MaintenanceHead/PlanPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanPage = () => {
    const [months] = useState([
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]);
    const [companies, setCompanies] = useState([]);
    const [machineTypes, setMachineTypes] = useState([]);
    const [formData, setFormData] = useState({
        month: '',
        company_id: '',
        machine_type_id: '',
        checkpoints: ['']
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch companies and machine types
        const fetchData = async () => {
            try {
                const companiesRes = await axios.get('http://localhost:5000/api/maintenance-head/companies', {
                    headers: { username: 'mainthead1' } // Replace with actual username
                });
                if (companiesRes.data.success) {
                    setCompanies(companiesRes.data.data);
                }

                const machineTypesRes = await axios.get('http://localhost:5000/api/maintenance-head/machine-types', {
                    headers: { username: 'mainthead1' } // Replace with actual username
                });
                if (machineTypesRes.data.success) {
                    setMachineTypes(machineTypesRes.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckpointChange = (index, value) => {
        const newCheckpoints = [...formData.checkpoints];
        newCheckpoints[index] = value;
        setFormData(prevState => ({
            ...prevState,
            checkpoints: newCheckpoints
        }));
    };

    const addCheckpoint = () => {
        setFormData(prevState => ({
            ...prevState,
            checkpoints: [...prevState.checkpoints, '']
        }));
    };

    const removeCheckpoint = (index) => {
        const newCheckpoints = formData.checkpoints.filter((_, i) => i !== index);
        setFormData(prevState => ({
            ...prevState,
            checkpoints: newCheckpoints
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/maintenance-head/create-pm-plan', formData, {
                headers: { username: 'mainthead1' } // Replace with actual username
            });
            if (res.data.success) {
                setMessage('PM Plan created successfully');
                // Reset form
                setFormData({
                    month: '',
                    company_id: '',
                    machine_type_id: '',
                    checkpoints: ['']
                });
            } else {
                setMessage('Failed to create PM Plan');
            }
        } catch (err) {
            console.error(err);
            setMessage('Server error');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-4">Maintenance Head - Plan PM</h1>
            {message && <p className="mb-4 text-green-500">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Month</label>
                    <select
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select Month</option>
                        {months.map((month, idx) => (
                            <option key={idx} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Company</label>
                    <select
                        name="company_id"
                        value={formData.company_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select Company</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.id}>{company.company_code}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Machine Type</label>
                    <select
                        name="machine_type_id"
                        value={formData.machine_type_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    >
                        <option value="">Select Machine Type</option>
                        {machineTypes.map(machine => (
                            <option key={machine.id} value={machine.id}>{machine.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700">Checkpoints</label>
                    {formData.checkpoints.map((checkpoint, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={checkpoint}
                                onChange={(e) => handleCheckpointChange(index, e.target.value)}
                                className="flex-1 px-3 py-2 border rounded"
                                required
                            />
                            {formData.checkpoints.length > 1 && (
                                <button type="button" onClick={() => removeCheckpoint(index)} className="ml-2 text-red-500">Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addCheckpoint} className="text-blue-500">Add Checkpoint</button>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create PM Plan</button>
            </form>
        </div>
    );
};

export default PlanPage;