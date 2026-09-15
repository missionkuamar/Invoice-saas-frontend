import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaSpinner, FaPalette } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const InvoiceTemplateSelector = ({ selectedTemplate, onSelect, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(selectedTemplate || null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data.data);
      if (!selected && response.data.data.length > 0) {
        setSelected(response.data.data[0]);
        onSelect(response.data.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (template) => {
    setSelected(template);
    onSelect(template);
    onClose();
  };

  const getTemplatePreview = (template) => {
    // Return template preview based on type
    const previews = {
      simple: 'bg-gradient-to-r from-blue-500 to-blue-600',
      modern: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      corporate: 'bg-gradient-to-r from-slate-700 to-slate-900',
      creative: 'bg-gradient-to-r from-pink-500 to-rose-600',
      minimal: 'bg-gradient-to-r from-gray-400 to-gray-600',
      elegant: 'bg-gradient-to-r from-amber-600 to-yellow-800',
    };
    return previews[template.type] || previews.simple;
  };

  const getTemplateIcon = (type) => {
    const icons = {
      simple: '📄',
      modern: '✨',
      corporate: '🏢',
      creative: '🎨',
      minimal: '⬜',
      elegant: '👔',
    };
    return icons[type] || '📄';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-primary-500 text-3xl" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaPalette className="text-primary-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                Choose Invoice Template
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template._id}
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selected?._id === template._id
                      ? 'border-primary-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelect(template)}
                >
                  {/* Preview */}
                  <div className={`h-32 ${getTemplatePreview(template)} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-1">{getTemplateIcon(template.type)}</div>
                      <div className="text-lg font-bold">{template.name}</div>
                      <div className="text-xs opacity-80">{template.type.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{template.name}</h4>
                        <p className="text-xs text-gray-500">{template.description}</p>
                      </div>
                      {selected?._id === template._id && (
                        <span className="bg-primary-500 text-white rounded-full p-1">
                          <FaCheck size={12} />
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                        {template.layout}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                        {template.style.fontFamily.split(',')[0]}
                      </span>
                    </div>

                    {/* Template Features */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.sections?.header?.enabled && (
                        <span className="text-xs text-gray-400">📋 Header</span>
                      )}
                      {template.sections?.footer?.enabled && (
                        <span className="text-xs text-gray-400">📄 Footer</span>
                      )}
                      {template.style.showLogo && (
                        <span className="text-xs text-gray-400">🖼️ Logo</span>
                      )}
                    </div>
                  </div>

                  {selected?._id === template._id && (
                    <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                      <FaCheck size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Select a template that best suits your business needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateSelector;