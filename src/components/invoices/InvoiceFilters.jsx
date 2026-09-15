// frontend/src/components/invoices/InvoiceFilters.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaSearch, FaFilter, FaTimes, FaSortAmountDown,
  FaSortAmountUp, FaUndo
} from 'react-icons/fa';
import { setFilters, clearFilters, fetchInvoices, localSearch } from '../../store/slices/invoiceSlice';
import { useTheme } from '../../themes/ThemeProvider';
import debounce from 'lodash/debounce';

const InvoiceFilters = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { filters, isOfflineSearch } = useSelector((state) => state.invoices);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const debouncedSearch = useCallback(
    debounce((value) => {
      if (value && value.trim().length > 0) {
        dispatch(localSearch({ query: value }));
        dispatch(setFilters({ search: value }));
        dispatch(fetchInvoices({ search: value }));
      } else {
        dispatch(setFilters({ search: '' }));
        dispatch(fetchInvoices({ search: '' }));
      }
    }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
    dispatch(fetchInvoices({ [name]: value }));
  };

  const handleSortChange = (field) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: field, sortOrder: newOrder }));
    dispatch(fetchInvoices({ sortBy: field, sortOrder: newOrder }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchInput('');
    dispatch(fetchInvoices({}));
    setShowFilters(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchInput.trim()) {
        dispatch(setFilters({ search: searchInput }));
        dispatch(fetchInvoices({ search: searchInput }));
      }
    }
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => 
    value && value !== '' && key !== 'sortBy' && key !== 'sortOrder'
  );

  return (
    <div className={`${theme.colors.card} rounded-2xl border ${theme.colors.border} p-3 md:p-4 shadow-sm space-y-3 md:space-y-4`}>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by invoice #, client name, or email..."
            value={searchInput}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
          />
          <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40`} />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                dispatch(setFilters({ search: '' }));
                dispatch(fetchInvoices({ search: '' }));
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.colors.text} opacity-40 hover:opacity-100`}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm ${
              showFilters ? `border-primary-500 ${theme.colors.background}` : ''
            }`}
          >
            <FaFilter /> 
            <span className="hidden xs:inline">Filters</span>
            {activeFilters.length > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>
          
          <button
            onClick={handleClearFilters}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border ${theme.colors.border} ${theme.colors.text} hover:${theme.colors.hover} transition-colors text-sm`}
            title="Reset all filters"
          >
            <FaUndo />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Search Status */}
      {isOfflineSearch && (
        <div className={`text-sm ${theme.colors.primary} ${theme.colors.background} p-2 rounded-xl flex items-center gap-2`}>
          <FaSearch className={theme.colors.primary} />
          Showing results from local cache. Click search again to refresh from server.
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className={`border-t ${theme.colors.border} pt-3 md:pt-4 mt-2`}>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={filters.invoiceNumber || ''}
                onChange={handleFilterChange}
                placeholder="INV-2024-00001"
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={filters.clientName || ''}
                onChange={handleFilterChange}
                placeholder="Client name"
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Client Email
              </label>
              <input
                type="email"
                name="clientEmail"
                value={filters.clientEmail || ''}
                onChange={handleFilterChange}
                placeholder="client@example.com"
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Status
              </label>
              <select
                name="status"
                value={filters.status || ''}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Min Amount (₹)
              </label>
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount || ''}
                onChange={handleFilterChange}
                placeholder="0"
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                min="0"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Max Amount (₹)
              </label>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount || ''}
                onChange={handleFilterChange}
                placeholder="100000"
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
                min="0"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate || ''}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate || ''}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.text} bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-3 md:mt-4 flex flex-wrap gap-2 items-center border-t ${theme.colors.border} pt-3">
            <span className={`text-sm font-medium ${theme.colors.text} mr-1`}>Sort by:</span>
            
            {['createdAt', 'total', 'client.name', 'status'].map((field) => (
              <button
                key={field}
                onClick={() => handleSortChange(field)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm transition-colors ${
                  filters.sortBy === field
                    ? `${theme.colors.background} ${theme.colors.primary}`
                    : `${theme.colors.hover} ${theme.colors.text} opacity-70`
                }`}
              >
                {field === 'createdAt' ? 'Date' : 
                 field === 'total' ? 'Amount' : 
                 field === 'client.name' ? 'Client' : 'Status'}
                {filters.sortBy === field && (
                  filters.sortOrder === 'asc' ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />
                )}
              </button>
            ))}
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <span key={key} className={`inline-flex items-center gap-1 ${theme.colors.background} px-2 py-1 rounded-full text-xs`}>
                  <span className={`font-medium ${theme.colors.text} opacity-70`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className={theme.colors.text}>{value}</span>
                  <button
                    onClick={() => {
                      dispatch(setFilters({ [key]: '' }));
                      dispatch(fetchInvoices({ [key]: '' }));
                    }}
                    className="text-red-400 hover:text-red-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;