"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import config from "../data/config.json";

import AdminNav from "@/components/AdminNav";

interface Withdrawal {
  id: number;
  name: string;
  phone: string;
  transaction_count: number;
  total_amount: string;
  transaction_ids: string;
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const accessToken = localStorage.getItem("accessToken");


  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ withdrawals: Withdrawal[] }>(
        `${config.baseUrl}/api/superlikes/withdrawals`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
    setLoading(false);
  };

  const markAsPaid = async (userId: number) => {
    try {
      await axios.post(
        `${config.baseUrl}/api/superlikes/withdrawals/complete`,
        {
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Refresh withdrawals after marking as paid
      fetchWithdrawals();
    } catch (error) {
      console.error("Error marking withdrawals as paid:", error);
    }
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
        />
        <input type="date" className="border border-gray-300 p-2 rounded" />
        <input type="date" className="border border-gray-300 p-2 rounded" />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Apply Filter
        </button>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Pending Withdrawals</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-gray-900">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Transactions</th>
                <th className="border p-3 text-left">Superlikes</th>
                <th className="border p-3 text-left">Total Amount</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    Loading Withdrawals...
                  </td>
                </tr>
              ) : withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b hover:bg-gray-100">
                    <td className="border p-3">{withdrawal.id}</td>
                    <td className="border p-3">{withdrawal.name}</td>
                    <td className="border p-3">{withdrawal.phone}</td>
                    <td className="border p-3">{withdrawal.transaction_count}</td>
                    <td className="border p-3">{withdrawal.total_amount}</td>
                    <td className="border p-3">{Number(withdrawal.total_amount) * 22}</td>
                    <td className="border p-3">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => markAsPaid(withdrawal.id)}
                      >
                        Mark as Paid
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No pending withdrawals.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
