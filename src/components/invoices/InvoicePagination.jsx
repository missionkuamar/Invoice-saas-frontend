// frontend/src/components/invoices/InvoicePagination.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { setPage, setLimit, fetchInvoices } from '../../store/slices/invoiceSlice';
import { useTheme } from '../../themes/ThemeProvider';

const InvoicePagination = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { pagination } = useSelector((state) => state.invoices);
    const { page, limit, total, pages } = pagination;

    const limitOptions = [5, 10, 20, 50, 100];

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            dispatch(setPage(newPage));
            dispatch(fetchInvoices({ page: newPage }));
        }
    };

    const handleLimitChange = (e) => {
        const newLimit = Number(e.target.value);
        dispatch(setLimit(newLimit));
        dispatch(fetchInvoices({ limit: newLimit, page: 1 }));
    };

    const getVisiblePages = () => {
        const pageNumbers = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(pages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    if (total === 0) return null;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 px-3 md:px-4 py-3 ${theme.colors.card} border ${theme.colors.border} rounded-xl`}>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto justify-center sm:justify-start">
                <span className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>
                    Showing <span className={`font-medium ${theme.colors.text}`}>{startItem}</span> to{' '}
                    <span className={`font-medium ${theme.colors.text}`}>{endItem}</span> of{' '}
                    <span className={`font-medium ${theme.colors.text}`}>{total}</span> invoices
                </span>

                <div className="flex items-center gap-2">
                    <label className={`text-xs md:text-sm ${theme.colors.text} opacity-70`}>Rows:</label>
                    <select
                        value={limit}
                        onChange={handleLimitChange}
                        className={`border ${theme.colors.border} ${theme.colors.text} bg-transparent rounded-lg px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    >
                        {limitOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                    className={`p-1.5 md:p-2 rounded-lg transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : theme.colors.hover}`}
                    title="First page"
                >
                    <HiChevronDoubleLeft className={`text-sm md:text-base ${theme.colors.text}`} />
                </button>

                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`p-1.5 md:p-2 rounded-lg transition-colors ${page === 1 ? 'opacity-30 cursor-not-allowed' : theme.colors.hover}`}
                    title="Previous page"
                >
                    <FaChevronLeft className={`text-sm md:text-base ${theme.colors.text}`} />
                </button>

                {getVisiblePages().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm transition-colors ${
                            pageNum === page
                                ? 'bg-primary-500 text-white'
                                : `${theme.colors.text} ${theme.colors.hover}`
                        }`}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className={`p-1.5 md:p-2 rounded-lg transition-colors ${page === pages ? 'opacity-30 cursor-not-allowed' : theme.colors.hover}`}
                    title="Next page"
                >
                    <FaChevronRight className={`text-sm md:text-base ${theme.colors.text}`} />
                </button>

                <button
                    onClick={() => handlePageChange(pages)}
                    disabled={page === pages}
                    className={`p-1.5 md:p-2 rounded-lg transition-colors ${page === pages ? 'opacity-30 cursor-not-allowed' : theme.colors.hover}`}
                    title="Last page"
                >
                    <HiChevronDoubleRight className={`text-sm md:text-base ${theme.colors.text}`} />
                </button>
            </div>
        </div>
    );
};

export default InvoicePagination;