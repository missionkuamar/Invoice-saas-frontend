import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSelector } from 'react-redux';
export default function SimpleEmail() {


  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    toEmail: '',
    subject: '',
    message: '',
    scheduleTime: ''
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const {user } = useSelector((state) => state.auth ||  {});

  //console.log(user);
  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await api.get('/emails/my-emails');
      setEmails(response.data.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await api.post('/auth/logout');
  //     setUser(null);
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //   }
  // };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post('/emails/schedule', formData);
      setMessage({ type: 'success', text: '✅ Email scheduled successfully!' });
      setFormData({ toEmail: '', subject: '', message: '', scheduleTime: '' });
      fetchEmails();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to schedule' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scheduled email?')) return;

    try {
      await api.delete(`/emails/${id}`);
      setEmails(emails.filter(email => email._id !== id));
      setMessage({ type: 'success', text: '✅ Email deleted!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-cyan-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-700 p-4 text-gray-100 rounded-lg shadow">
          <div >
            <h1 className="text-2xl font-boldb bg-gray-700 text-gray-100">📧 Email Scheduler</h1>
            <p className="bg-gray-700 text-gray-100 ">Welcome, {user?.name}!</p>
          </div>
          {/* <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button> */}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 bg-gray-700 text-gray-100">
          {/* Schedule Form */}
          <div className="bg-gray-700 text-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Schedule Email</h2>
            
            <form onSubmit={handleSchedule}>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="To Email"
                  value={formData.toEmail}
                  onChange={(e) => setFormData({...formData, toEmail: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  required
                />
              </div>

              <div className="mb-3">
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  rows="4"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="datetime-local"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500  text-black"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Email'}
              </button>
            </form>
          </div>

          {/* Email List */}
          <div className="bg-gray-700 text-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Scheduled Emails</h2>
            
            {emails.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No emails scheduled</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto text-gray-50">
                {emails.map((email) => (
                  <div key={email._id} className="border rounded p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{email.subject}</h3>
                        <p className="text-sm text-gray-50">To: {email.toEmail}</p>
                        <p className="text-sm text-gray-50">
                          Scheduled: {new Date(email.scheduleTime).toLocaleString()}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                          email.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          email.status === 'sent' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {email.status}
                        </span>
                      </div>
                      {email.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(email._id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}