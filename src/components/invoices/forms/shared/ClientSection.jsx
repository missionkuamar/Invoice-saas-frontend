// frontend/src/components/invoices/forms/shared/ClientSection.jsx
import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const colorStyles = {
  blue: {
    ring: 'focus:ring-blue-500',
    border: 'border-blue-300',
    text: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  purple: {
    ring: 'focus:ring-purple-500',
    border: 'border-purple-300',
    text: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  pink: {
    ring: 'focus:ring-pink-500',
    border: 'border-pink-300',
    text: 'text-pink-500',
    bg: 'bg-pink-50',
  },
  green: {
    ring: 'focus:ring-green-500',
    border: 'border-green-300',
    text: 'text-green-500',
    bg: 'bg-green-50',
  },
  amber: {
    ring: 'focus:ring-amber-500',
    border: 'border-amber-300',
    text: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  gray: {
    ring: 'focus:ring-gray-500',
    border: 'border-gray-300',
    text: 'text-gray-500',
    bg: 'bg-gray-50',
  },
  cyan: {
    ring: 'focus:ring-cyan-500',
    border: 'border-cyan-300',
    text: 'text-cyan-500',
    bg: 'bg-cyan-50',
  },
  indigo: {
    ring: 'focus:ring-indigo-500',
    border: 'border-indigo-300',
    text: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  violet: {
    ring: 'focus:ring-violet-500',
    border: 'border-violet-300',
    text: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  orange: {
    ring: 'focus:ring-orange-500',
    border: 'border-orange-300',
    text: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  red: {
    ring: 'focus:ring-red-500',
    border: 'border-red-300',
    text: 'text-red-500',
    bg: 'bg-red-50',
  },
  yellow: {
    ring: 'focus:ring-yellow-500',
    border: 'border-yellow-300',
    text: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  emerald: {
    ring: 'focus:ring-emerald-500',
    border: 'border-emerald-300',
    text: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  fuchsia: {
    ring: 'focus:ring-fuchsia-500',
    border: 'border-fuchsia-300',
    text: 'text-fuchsia-500',
    bg: 'bg-fuchsia-50',
  },
};

const ClientSection = ({ 
  formData, 
  handleClientChange, 
  setFormData,
  columns = 2,
  iconStyle = false,
  accentColor = 'blue'
}) => {
  const colors = colorStyles[accentColor] || colorStyles.blue;
  
  const baseInputClasses = `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colors.ring}`;
  const iconInputClasses = `w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colors.ring}`;
  
  const inputClasses = iconStyle ? iconInputClasses : baseInputClasses;
  const inputIconClass = `absolute left-3 top-3 ${colors.text}`;

  const client = formData?.client || {};

  // Handle date changes
  const handleDateChange = (field, value) => {
    if (setFormData) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
      <div className="space-y-3">
        <div className={iconStyle ? 'relative' : ''}>
          {iconStyle && <FaUser className={inputIconClass} />}
          <input
            type="text"
            name="name"
            value={client.name || ''}
            onChange={handleClientChange}
            className={inputClasses}
            placeholder="Client Name *"
            required
          />
        </div>
        <div className={iconStyle ? 'relative' : ''}>
          {iconStyle && <FaEnvelope className={inputIconClass} />}
          <input
            type="email"
            name="email"
            value={client.email || ''}
            onChange={handleClientChange}
            className={inputClasses}
            placeholder="Client Email"
          />
        </div>
        <div className={iconStyle ? 'relative' : ''}>
          {iconStyle && <FaPhone className={inputIconClass} />}
          <input
            type="text"
            name="phone"
            value={client.phone || ''}
            onChange={handleClientChange}
            className={inputClasses}
            placeholder="Phone"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div className={iconStyle ? 'relative' : ''}>
          {iconStyle && <FaMapMarkerAlt className={inputIconClass} />}
          <textarea
            name="address"
            value={client.address || ''}
            onChange={handleClientChange}
            className={`${inputClasses} resize-none`}
            rows="2"
            placeholder="Address"
          />
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Issue Date</label>
            <input
              type="date"
              value={formData.issueDate || ''}
              onChange={(e) => handleDateChange('issueDate', e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colors.ring}`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => handleDateChange('dueDate', e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colors.ring}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSection;