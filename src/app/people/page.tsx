"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminNav from "@/components/AdminNav";


// User type definition
interface User {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  active: number;
  created_at: string;
  last_login: string;
}

export default function UserProfiles() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    setLoading(true);
    fetchUsers();
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:5000/api/user-profiles",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.phone.includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleDateFilter = () => {
    const { start, end } = dateRange;
    if (!start || !end) return;

    const filtered = users.filter((user) => {
      const createdAt = new Date(user.created_at);
      return createdAt >= new Date(start) && createdAt <= new Date(end);
    });

    setFilteredUsers(filtered);
  };

  const toggleActivation = async (userId: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status
      const response = await axios.post(
        "http://localhost:5000/api/users/toggle-user-status",
        {
          user_id: userId,
          active: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Update state after successful request
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, active: newStatus } : user
          )
        );
        setFilteredUsers((prevFilteredUsers) =>
          prevFilteredUsers.map((user) =>
            user.id === userId ? { ...user, active: newStatus } : user
          )
        );

        // Reload Page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };  

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const currTimestamp = new Date().toISOString();

    saveAs(data, `UserProfiles - ${currTimestamp}.xlsx`);
  };

  return (
    <div className="lg:px-24 p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Navbar */}
        <AdminNav />


      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
          value={search}
          onChange={handleSearch}
        />

        <input
          type="date"
          className="border border-gray-300 p-2 rounded"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
        <input
          type="date"
          className="border border-gray-300 p-2 rounded"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleDateFilter}
        >
          Apply Filter
        </button>

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={downloadExcel}
        >
          Download Excel
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg text-gray-900">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">User Type</th>
              <th className="border p-3 text-left">Active</th>
              <th className="border p-3 text-left">Created At</th>
              <th className="border p-3 text-left">Last Login</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr>
                <td colSpan={9} className="text-center p-4">
                    <span className="text-gray-600 font-semibold">Loading users...</span>
                </td>
                </tr>
            ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="border p-3">{user.id}</td>
                    <td className="border p-3">{user.name}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.phone}</td>
                    <td className="border p-3">{user.user_type}</td>
                    <td className="border p-3">
                    {user.active ? (
                        <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                    )}
                    </td>
                    <td className="border p-3">
                    {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                    {new Date(user.last_login).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                    <button
                        className={`px-3 py-1 rounded text-white font-semibold ${
                            user.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                        }`}
                        onClick={() => toggleActivation(user.user_id, user.active)}
                    >
                        {user.active ? "Deactivate" : "Activate"}
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={9} className="text-center p-4 text-gray-500">
                    Loading Users...
                </td>
                </tr>
            )}
            </tbody>

        </table>
      </div>
    </div>
  );
}
