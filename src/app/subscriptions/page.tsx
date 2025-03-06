"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminNav from "@/components/AdminNav";

import config from "../data/config.json";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/Redux/Store";

// Subscription type definition
interface Subscription {
  user_id: number;
  user_name: string;
  user_phone: string;
  end_date: string;
  payment_status: string;
  updated_at: string;
  plan_id: number;
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [searchPhone, setSearchPhone] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
      console.log('Redux User => ', user);
  
      if (!isAdmin(user.user_type)) {
        console.log("This is not an admin");
        window.location.href = "/main";
      } else {
        console.log("Admin logged in");
      }
    }, [user]); 
  
    const isAdmin = (user_type: string): boolean => {
      return user_type === 'admin';
    };

  useEffect(() => {
    setLoading(true);
    fetchSubscriptions();
    setLoading(false);
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchPhone, searchName]); // Filters update in real-time when input changes

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get<Subscription[]>(`${config.baseUrl}/api/subscriptions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSubscriptions(response.data);
      setFilteredSubscriptions(response.data);
    } catch (error) {
      console.log("Error fetching subscriptions:", error);
    }
  };

  const handleFilter = () => {
    const filtered = subscriptions.filter(
      (sub) =>
        (!searchPhone || sub.user_phone.includes(searchPhone)) &&
        (!searchName || sub.user_name.toLowerCase().includes(searchName.toLowerCase()))
    );
    setFilteredSubscriptions(filtered);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSubscriptions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscriptions");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const currTimestamp = new Date().toISOString();
    saveAs(data, `Subscriptions-${currTimestamp}.xlsx`);
  };

  return (
    <div className="lg:px-24 p-6 bg-gray-50 min-h-screen text-gray-900">
        <AdminNav />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 p-2 rounded"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by phone"
          className="border border-gray-300 p-2 rounded"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={downloadExcel}
        >
          Download Excel
        </button>
      </div>

      {/* Subscription Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg text-gray-900">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3 text-left">User ID</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">End Date</th>
              <th className="border p-3 text-left">Payment Status</th>
              <th className="border p-3 text-left">Updated At</th>
              <th className="border p-3 text-left">Plan ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Loading...</td>
              </tr>
            ) : filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((sub) => (
                <tr key={sub.user_id} className="border-b hover:bg-gray-100">
                  <td className="border p-3">{sub.user_id}</td>
                  <td className="border p-3">{sub.user_name}</td>
                  <td className="border p-3">{sub.user_phone}</td>
                  <td className="border p-3">{new Date(sub.end_date).toLocaleDateString()}</td>
                  <td className="border p-3">{sub.payment_status}</td>
                  <td className="border p-3">{new Date(sub.updated_at).toLocaleDateString()}</td>
                  <td className="border p-3">{sub.plan_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">Loading subscriptions...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
