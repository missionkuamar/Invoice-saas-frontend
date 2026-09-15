// frontend/src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useTheme } from '../themes/ThemeProvider';
import SettingsLayout from '../components/settings/SettingsLayout';
import PersonalInfo from '../components/settings/PersonalInfo';
import CompanyInfo from '../components/settings/CompanyInfo';
import TaxSettings from '../components/settings/TaxSettings';
import BankDetails from '../components/settings/BankDetails';
import InvoiceSettings from '../components/settings/InvoiceSettings';
import LogoUpload from '../components/settings/LogoUpload';
import api from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/company');
      setCompany(response.data.data);
    } catch (error) {
      toast.error('Failed to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      const response = await api.put('/company', data);
      setCompany(response.data.data);
      toast.success('Settings updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
      throw error;
    }
  };

  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const response = await api.post('/company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCompany(prev => ({ ...prev, logo: response.data.data }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      throw error;
    }
  };

  const handleDeleteLogo = async () => {
    try {
      await api.delete('/company/logo');
      setCompany(prev => ({ ...prev, logo: {} }));
      toast.success('Logo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete logo');
      throw error;
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    // { id: 'company', label: 'Company', icon: '🏢' },
    // { id: 'tax', label: 'Tax Settings', icon: '💰' },
    // { id: 'bank', label: 'Bank Details', icon: '🏦' },
    // { id: 'invoice', label: 'Invoice Settings', icon: '📄' },
  ];

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-64 ${theme.colors.background}`}>
        <div className="text-center">
          <FaSpinner className={`animate-spin text-4xl ${theme.colors.primary} mx-auto mb-4`} />
          <p className={theme.colors.text}>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} p-3 md:p-6`}>
      <div className="max-w-7xl mx-auto">
        <SettingsLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        >
          {activeTab === 'personal' && (
            <PersonalInfo 
              company={company} 
              onUpdate={handleUpdate}
              user={user}
            />
          )}
          {activeTab === 'company' && (
            <CompanyInfo 
              company={company} 
              onUpdate={handleUpdate}
              onLogoUpload={handleLogoUpload}
              onDeleteLogo={handleDeleteLogo}
            />
          )}
          {activeTab === 'tax' && (
            <TaxSettings 
              company={company} 
              onUpdate={handleUpdate}
            />
          )}
          {activeTab === 'bank' && (
            <BankDetails 
              company={company} 
              onUpdate={handleUpdate}
            />
          )}
          {activeTab === 'invoice' && (
            <InvoiceSettings 
              company={company} 
              onUpdate={handleUpdate}
            />
          )}
        </SettingsLayout>
      </div>
    </div>
  );
};

export default Settings;