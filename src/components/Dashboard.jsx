import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MdDelete } from "react-icons/md";
import { FadeLoader } from 'react-spinners'; // Import FadeLoader

const API_URL = import.meta.env.VITE_API_URL || 'https://calorie-tracker-backend-6nfn.onrender.com';
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL); // Debug

const Dashboard = ({ token, onLogout }) => {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState('');
  const [meal, setMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Dashboard mounted with token:', token.substring(0, 20) + '...');
    loadEntries();
    return () => {
      console.log('Dashboard unmounting');
    };
  }, [token]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/calories/view`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('View entries response:', data, 'Status:', response.status);
      if (response.ok) {
        setEntries(data);
      } else {
        console.error('View entries error:', data.error || 'Unknown error');
        if (data.error === 'Invalid token') {
          onLogout();
        }
      }
    } catch (err) {
      console.error('Load entries fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/calories/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date, meal, calories: parseInt(calories) }),
      });
      const data = await response.json();
      console.log('Add entry response:', data, 'Status:', response.status);
      if (response.ok) {
        loadEntries();
        setDate('');
        setMeal('');
        setCalories('');
      } else {
        alert(data.error || 'Add error');
        if (data.error === 'Invalid token') {
          onLogout();
        }
      }
    } catch (err) {
      console.error('Add fetch error:', err);
      alert('Add error');
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/calories/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Delete entry response:', data, 'Status:', response.status);
      if (response.ok) {
        loadEntries();
      } else {
        alert(data.error || 'Delete error');
        if (data.error === 'Invalid token') {
          onLogout();
        }
      }
    } catch (err) {
      console.error('Delete fetch error:', err);
      alert('Delete error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <FadeLoader
          color="#2563eb" // Blue to match Tailwind's bg-blue-600
          height={15}
          width={5}
          radius={2}
          margin={2}
          loading={loading}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="text-gray-900"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Header with Logout Button */}
      <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calorie Tracker</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Add Entry Form */}
          <form onSubmit={addEntry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                placeholder="Meal"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Calories"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Meal
            </button>
          </form>

          {/* Entries Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Entries</h2>
            {entries?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Meal</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Calories</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {format(new Date(entry.date), 'MMMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{entry.meal}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{entry.calories} cal</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <MdDelete
                            onClick={() => deleteEntry(entry.id)}
                            className="text-3xl text-red-700 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No entries yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;