import React from 'react';
import { 
  FaRupeeSign, 
  FaPercent, 
  FaCalculator,
  FaTruck,
  FaGift,
  FaWallet,
} from 'react-icons/fa';

const InvoiceSummary = ({ 
  subtotal, 
  totalTax, 
  total, 
  discount = 0, 
  shipping = 0,
  currency = 'INR',
  items = []
}) => {
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate total discount amount
  const totalDiscountAmount = items.reduce((sum, item) => {
    const qty = Number(item?.quantity) || 0;
    const rate = Number(item?.rate) || 0;
    const disc = Number(item?.discount) || 0;
    return sum + (qty * rate * disc / 100);
  }, 0);

  // Calculate effective tax
  const effectiveTaxRate = subtotal > 0 ? (totalTax / subtotal * 100) : 0;

  const summaryItems = [
    {
      label: 'Subtotal',
      value: subtotal,
      icon: FaWallet,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      label: 'Total Discount',
      value: -totalDiscountAmount,
      icon: FaGift,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      show: totalDiscountAmount > 0,
    },
    {
      label: `Total Tax (${effectiveTaxRate.toFixed(1)}%)`,
      value: totalTax,
      icon: FaPercent,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Shipping',
      value: shipping,
      icon: FaTruck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      show: shipping > 0,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <FaCalculator className="text-primary-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side - Detailed breakdown */}
        <div className="space-y-2">
          {summaryItems.map((item, index) => {
            if (item.show === false) return null;
            
            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${item.bgColor}`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className={`${item.color} text-sm`} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {formatCurrency(item.value)}
                </span>
              </div>
            );
          })}

          {/* Item count */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Items</span>
            <span className="text-sm font-semibold text-gray-600">{items.length}</span>
          </div>
        </div>

        {/* Right side - Total */}
        <div className="flex flex-col justify-center items-center md:items-end">
          <div className="w-full max-w-xs">
            <div className="border-t-2 border-gray-200 pt-3 mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-base font-medium text-gray-600">Grand Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(total)}
                </span>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Avg Tax Rate</p>
                <p className="text-sm font-semibold text-gray-700">
                  {effectiveTaxRate.toFixed(1)}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-500">Total Items</p>
                <p className="text-sm font-semibold text-gray-700">
                  {items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax break down */}
      {items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Tax Breakdown
          </p>
          <div className="flex flex-wrap gap-2">
            {items.reduce((acc, item) => {
              const taxRate = Number(item?.taxRate) || 0;
              const qty = Number(item?.quantity) || 0;
              const rate = Number(item?.rate) || 0;
              const disc = Number(item?.discount) || 0;
              const amount = qty * rate;
              const discountAmount = (amount * disc) / 100;
              const taxable = amount - discountAmount;
              const tax = (taxable * taxRate) / 100;
              
              if (tax > 0) {
                const existing = acc.find(t => t.rate === taxRate);
                if (existing) {
                  existing.total += tax;
                } else {
                  acc.push({ rate: taxRate, total: tax });
                }
              }
              return acc;
            }, []).map((tax, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {tax.rate}% Tax
                <span className="font-bold">₹{tax.total.toFixed(2)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceSummary;