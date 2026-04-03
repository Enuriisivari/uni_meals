import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import StaffForm from '../components/StaffForm';
import StaffTable from '../components/StaffTable';

const StaffManagement = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/staff');
      if (response.data.success) {
        setStaffData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load staff');
      console.error(error);
    }
  };

  const handleSaveStaff = async (staffMember) => {
    try {
      const response = await axios.post('/api/staff', staffMember);
      if (response.data.success) {
        toast.success('Staff added successfully!');
        setStaffData([...staffData, response.data.data]);
      }
    } catch (error) {
      toast.error('Failed to add staff');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Canteen Staff Management</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="admin-card"><StaffForm onSave={handleSaveStaff} /></div>
        <div className="admin-card"><StaffTable data={staffData} /></div>
      </div>
    </div>
  );
};

export default StaffManagement;
