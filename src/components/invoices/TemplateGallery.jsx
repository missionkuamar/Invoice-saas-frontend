import React from 'react';
import { FaCheck, FaPalette } from 'react-icons/fa';

const TemplateGallery = ({ templates = [], onSelect, selected }) => {
  const getTemplateStyles = (type) => {
    const styles = {
      simple: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-200',
        icon: '📄',
        color: 'text-blue-600',
      },
      modern: {
        bg: 'bg-gradient-to-br from-purple-50 to-indigo-100',
        border: 'border-purple-200',
        icon: '✨',
        color: 'text-purple-600',
      },
      corporate: {
        bg: 'bg-gradient-to-br from-slate-50 to-slate-200',
        border: 'border-slate-300',
        icon: '🏢',
        color: 'text-slate-700',
      },
      creative: {
        bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
        border: 'border-pink-200',
        icon: '🎨',
        color: 'text-pink-600',
      },
      minimal: {
        bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
        border: 'border-gray-300',
        icon: '⬜',
        color: 'text-gray-600',
      },
      elegant: {
        bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
        border: 'border-amber-200',
        icon: '👔',
        color: 'text-amber-700',
      },
    };
    return styles[type] || styles.simple;
  };

  const getBusinessUse = (type) => {
    const uses = {
      simple: 'Freelancers, Small Shops',
      modern: 'Tech Startups, Agencies',
      corporate: 'Large Businesses, Corporations',
      creative: 'Design Studios, Artists',
      minimal: 'Consultants, Minimalists',
      elegant: 'Luxury Brands, Premium Services',
    };
    return uses[type] || '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => {
        const style = getTemplateStyles(template.type);
        const isSelected = selected?._id === template._id;

        return (
          <div
            key={template._id}
            className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-2xl ${
              isSelected ? 'ring-2 ring-primary-500 shadow-xl' : ''
            }`}
            onClick={() => onSelect(template)}
          >
            {/* Template Preview */}
            <div className={`${style.bg} p-6 h-48 flex flex-col items-center justify-center`}>
              <div className="text-6xl mb-2">{style.icon}</div>
              <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>

            {/* Template Details */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500">{template.layout}</span>
              </div>

              <p className="text-xs text-gray-500 mb-3">{getBusinessUse(template.type)}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.sections?.header?.enabled && (
                  <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">Header</span>
                )}
                {template.style.showLogo && (
                  <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">Logo</span>
                )}
                {template.sections?.footer?.enabled && (
                  <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">Footer</span>
                )}
                {template.style.showTerms && (
                  <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">Terms</span>
                )}
              </div>

              {/* Color Scheme */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: template.style?.primaryColor }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: template.style?.secondaryColor }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {template.style?.fontFamily?.split(',')[0] || 'Inter'}
                </span>
              </div>
            </div>

            {/* Selection Badge */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1.5 shadow-lg">
                <FaCheck size={12} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TemplateGallery;