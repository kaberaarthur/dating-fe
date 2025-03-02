"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminNav from "@/components/AdminNav";

import config from "../data/config.json";

// Mpesa Transaction type definition
interface MpesaTransaction {
  id: number;
  amount: number;
  mpesa_receipt_number: string;
  phone: string;
  created_at: string;
}

export default function MpesaTransactions() {
  const [transactions, setTransactions] = useState<MpesaTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<MpesaTransaction[]>([]);
  const [searchAmount, setSearchAmount] = useState<string>(""); 
  const [searchPhone, setSearchPhone] = useState<string>("");
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchTransactions();
    setLoading(false);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get<MpesaTransaction[]>(
        `${config.baseUrl}/api/mpesa-payments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }
  };

  const handleSearch = () => {
    const filtered = transactions.filter(
      (transaction) =>
        (searchPhone === "" || transaction.phone.includes(searchPhone)) &&
        (searchAmount === "" || transaction.amount.toString().includes(searchAmount))
    );
    setFilteredTransactions(filtered);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const currTimestamp = new Date().toISOString();

    saveAs(data, `MpesaTransaction - ${currTimestamp}.xlsx`);
  };

  return (
    <div className="lg:px-24 p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Navbar */}
      <AdminNav />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by amount"
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by phone number"
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
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

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg text-gray-900">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Amount</th>
              <th className="border p-3 text-left">Mpesa Receipt Number</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  <span className="text-gray-600 font-semibold">Loading transactions...</span>
                </td>
              </tr>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-100">
                  <td className="border p-3">{transaction.id}</td>
                  <td className="border p-3">{transaction.amount}</td>
                  <td className="border p-3">{transaction.mpesa_receipt_number}</td>
                  <td className="border p-3">{transaction.phone}</td>
                  <td className="border p-3">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  Loading Transactions...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
