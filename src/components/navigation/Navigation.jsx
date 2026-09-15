// frontend/src/components/navigation/Navigation.jsx
import { 
  FaHome, 
  FaFileInvoice, 
  FaPlus, 
  FaCreditCard, 
  FaShareAlt, 
  FaCog,
  FaFileInvoiceDollar
} from 'react-icons/fa';

const userMenuItems = [
  { 
    path: '/dashboard', 
    icon: FaHome, 
    label: 'Dashboard',
    description: 'Overview & statistics'
  },
  { 
    path: '/invoices', 
    icon: FaFileInvoice, 
    label: 'Invoices',
    description: 'Manage all invoices'
  },
  { 
    path: '/create-invoice/standard', 
    icon: FaPlus, 
    label: 'Create Invoice',
    description: 'Create new invoice',
    subItems: [
      { path: '/create-invoice/standard', label: 'Standard' },
      { path: '/create-invoice/modern', label: 'Modern' },
      { path: '/create-invoice/minimal', label: 'Minimal' },
      { path: '/create-invoice/professional', label: 'Professional' },
      { path: '/create-invoice/creative', label: 'Creative' },
    ]
  },
  { 
    path: '/subscription', 
    icon: FaCreditCard, 
    label: 'Subscription',
    description: 'Manage your plan'
  },
  { 
    path: '/affiliate', 
    icon: FaShareAlt, 
    label: 'Affiliate',
    description: 'Referral program'
  },
  { 
    path: '/settings', 
    icon: FaCog, 
    label: 'Settings',
    description: 'Account preferences'
  },
];