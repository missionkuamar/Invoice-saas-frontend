// frontend/src/components/emails/EmailFilters.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../themes/ThemeProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmails, resetFilters, setFilters } from '../../store/slices/emailSlice';

const EmailFilters = ({ onApplyFilters, onResetFilters }) => {
    //  { filters, onApplyFilters, onResetFilters }
    const { theme } = useTheme();
    const dispatch = useDispatch();
    //   const [localFilters, setLocalFilters] = useState({
    //     search: filters.search || '',
    //     status: filters.status || '',
    //     emailType: filters.emailType || '',
    //     startDate: filters.startDate || '',
    //     endDate: filters.endDate || '',
    //     sortBy: filters.sortBy || 'createdAt',
    //     sortOrder: filters.sortOrder || 'desc'
    //   });

    const { filters } = useSelector((state) => state.emails)
    // Update local filters when Redux filters change
    //   useEffect(() => {
    //     setLocalFilters({
    //       search: filters.search || '',
    //       status: filters.status || '',
    //       emailType: filters.emailType || '',
    //       startDate: filters.startDate || '',
    //       endDate: filters.endDate || '',
    //       sortBy: filters.sortBy || 'createdAt',
    //       sortOrder: filters.sortOrder || 'desc'
    //     });
    //   }, [filters]);

    const [localFilters, setLocalFilters] = useState({
        status: filters.status || '',
        emailType: filters.emailType || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc'
    })

    const handleApply = () => {
        dispatch(fetchEmails({ ...localFilters, page: 1 }));
        dispatch(fetchEmails({ ...fetchEmails, ...localFilters, page: 1 }));
    }

    const emailTypes = [
        { value: '', label: 'All Types' },
        { value: 'invoice', label: '💰 Invoice' },
        { value: 'reminder', label: '⏰ Reminder' },
        { value: 'overdue', label: '🚨 Overdue' },
        { value: 'confirmation', label: '✅ Confirmation' },
        { value: 'cancellation', label: '❌ Cancellation' },
        { value: 'revised', label: '📝 Revised' },
        { value: 'proforma', label: '📄 Proforma' },
        { value: 'credit_note', label: '💳 Credit Note' },
        { value: 'recurring', label: '🔄 Recurring' }
    ];

    const statuses = [
        { value: '', label: 'All Status' },
        { value: 'pending', label: '⏳ Pending' },
        { value: 'sent', label: '✅ Sent' },
        { value: 'failed', label: '❌ Failed' }
    ];

    const sortOptions = [
        { value: 'createdAt', label: 'Created Date' },
        { value: 'scheduleTime', label: 'Schedule Time' },
        { value: 'status', label: 'Status' },
        { value: 'emailType', label: 'Email Type' }
    ];



    const handleReset = () => {
        const resetData = {
            search: '',
            status: '',
            emailType: '',
            startDate: '',
            endDate: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        };
        setLocalFilters(resetData);
        dispatch(resetFilters());
        dispatch(fetchEmails({ ...resetFilters, page: 1 }));
        // onResetFilters();
    };



    const hanlderSearch = (e) => {
        const value = e.target.value;
        dispatch(setFilters({ search: value, page: 1 }));
    }
    // Handle Enter key for search
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            dispatch(fetchEmails({ ...filters, search: filters.search }));
        }
    };


    return (
        <div className={`${theme.colors.card} p-4 rounded-xl border ${theme.colors.border} mb-4`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        Search
                    </label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={hanlderSearch}
                        onKeyPress={handleKeyPress}
                        placeholder="Search by email, subject..."
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100`}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        Status
                    </label>
                    <select
                        value={localFilters?.status}
                        onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100`}
                    >
                        {statuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Email Type */}
                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        Email Type
                    </label>
                    <select
                        value={localFilters?.emailType}
                        onChange={(e) => setLocalFilters({ ...localFilters, emailType: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100`}
                    >
                        {emailTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        Sort By
                    </label>
                    <select
                        value={localFilters?.sortBy}
                        onChange={(e) => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100`}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range */}
                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={localFilters?.startDate}
                        onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100`}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        End Date
                    </label>
                    <input
                        type="date"
                        value={localFilters?.endDate}
                        onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100`}
                    />
                </div>

                {/* Sort Order */}
                <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-1`}>
                        Sort Order
                    </label>
                    <select
                        value={localFilters?.sortOrder}
                        onChange={(e) => setLocalFilters({ ...localFilters, sortOrder: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border ${theme.colors.border} ${theme.colors.background} ${theme.colors.text} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-100 `}
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                    <button
                        onClick={handleApply}
                        className={`${theme.colors.button} text-white px-6 py-2 rounded-lg hover:scale-105 transition-all flex-1`}
                    >
                        🔍 Apply
                    </button>
                    <button
                        onClick={handleReset}
                        className={`border ${theme.colors.border} ${theme.colors.text} px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all`}
                    >
                        ↩️ Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailFilters;