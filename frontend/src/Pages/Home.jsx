import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const logout = useAuthStore((state) => state.logout);

  const API_URL = import.meta.env.VITE_API_URL + "/api";

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${API_URL}/getUser`, { withCredentials: true });
        setUsers(res.data);
        setLoading(false);
      } catch {
        setError('Failed to fetch users.');
        setLoading(false);
      }
    }
    fetchUsers();
  }, [API_URL]);

  const handleLogout = async () => {
    try {
      logout();
      window.location.href = "/login"; 
    } catch (err) {
      console.error("Login error:", err);
      alert("ไม่สามารถออกจากระบบได้");
    }
  }

  if (loading) return <div className="p-4 text-center">Loading users...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-700"
        >
          ออกจการะบบ
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">ID</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Email</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200">{user.id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
