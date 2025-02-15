"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import config from "../data/config.json";
import AdminNav from "@/components/AdminNav";

interface Plan {
  id: number;
  name: string;
  description: string;
  features: string;
  period: number;
  price_male: string;
  price_female: string;
}

const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<Plan>({
    id: 0,
    name: "",
    description: "",
    features: "",
    period: 0,
    price_male: "",
    price_female: "",
  });

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get<{ plans: Plan[] }>(
        `${config.baseUrl}/api/plans`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setPlans(response.data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    console.log("Deleting plan with ID:", id);
    setDeleteModalOpen(false);
    fetchPlans(); // Refresh list after deletion
  };

  const openEditModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setFormData(plan);
    setEditModalOpen(true);
  };

  const handleAddPlanSubmit = async () => {
    console.log("Adding plan:", formData);
  
    try {
      const response = await fetch(`${config.baseUrl}/api/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to add plan: ${response.statusText}`);
      }
  
      console.log("Plan added successfully");
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  
    setAddModalOpen(false);
    fetchPlans(); // Refresh list after addition
  };
  

  const handleEditPlanSubmit = async () => {
    console.log("Editing plan:", formData);
  
    try {
      const response = await fetch(`${config.baseUrl}/api/plans/${formData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update plan: ${response.statusText}`);
      }
  
      console.log("Plan updated successfully");
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  
    setEditModalOpen(false);
    fetchPlans(); // Refresh list after edit
  };
  

  return (
    <div className="lg:px-24 p-6 bg-gray-50 min-h-screen text-gray-900">
      <AdminNav />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Plans</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add New Plan
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-100">
                  {plan.name}
                </h2>
                <p className="text-gray-400">{plan.description}</p>
                <div className="text-gray-300 font-bold">
                  <p>Male: Kes {plan.price_male}</p>
                  <p>Female: Kes {plan.price_female}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => openEditModal(plan)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setDeleteModalOpen(true);
                  }}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedPlan && (
        <Modal
          title="Delete Plan"
          content={`Are you sure you want to delete the ${selectedPlan.name} plan?`}
          onClose={() => setDeleteModalOpen(false)}
          onSubmit={() => handleDelete(selectedPlan.id)}
          submitText="Delete"
        />
      )}

      {/* Add Plan Modal */}
      {addModalOpen && (
        <PlanFormModal
          title="Add New Plan"
          formData={formData}
          setFormData={setFormData}
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddPlanSubmit}
        />
      )}

      {/* Edit Plan Modal */}
      {editModalOpen && selectedPlan && (
        <PlanFormModal
          title="Edit Plan"
          formData={formData}
          setFormData={setFormData}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditPlanSubmit}
        />
      )}
    </div>
  );
};

// Reusable Modal Component
const Modal = ({
  title,
  content,
  onClose,
  onSubmit,
  submitText,
}: {
  title: string;
  content: string;
  onClose: () => void;
  onSubmit: () => void;
  submitText: string;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-lg font-bold text-gray-200">{title}</h2>
      <p className="text-gray-200 mt-2">{content}</p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-red-600 text-white rounded-md"
        >
          {submitText}
        </button>
      </div>
    </div>
  </div>
);

// Reusable Plan Form Modal
const PlanFormModal = ({
  title,
  formData,
  setFormData,
  onClose,
  onSubmit,
}: {
  title: string;
  formData: Plan;
  setFormData: (data: Plan) => void;
  onClose: () => void;
  onSubmit: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-bold text-gray-200">{title}</h2>
      <div className="mt-4 space-y-3">
        {/* Name Field */}
        <label className="block text-gray-300 text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Plan Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 bg-gray-800 text-white rounded-md"
        />

        {/* Description Field */}
        <label className="block text-gray-300 text-sm font-medium" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          type="text"
          placeholder="Plan Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 bg-gray-800 text-white rounded-md"
        />

        {/* Features Field 
        <label className="block text-gray-300 text-sm font-medium" htmlFor="features">
          Features
        </label>
        <input
          id="features"
          type="text"
          placeholder="Plan Features"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          className="w-full p-2 bg-gray-800 text-white rounded-md"
        />*/}

        {/* Period Field */}
        <label className="block text-gray-300 text-sm font-medium" htmlFor="period">
          Period (in days)
        </label>
        <input
          id="period"
          type="number"
          placeholder="Plan Period"
          value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
          className="w-full p-2 bg-gray-800 text-white rounded-md"
        />

        {/* Male Price Field */}
        <label className="block text-gray-300 text-sm font-medium" htmlFor="price_male">
          Male Price (Kes)
        </label>
        <input
          id="price_male"
          type="number"
          placeholder="Male Price"
          value={formData.price_male}
          onChange={(e) => setFormData({ ...formData, price_male: e.target.value })}
          className="w-full p-2 bg-gray-800 text-white rounded-md"
        />

        {/* Female Price Field */}
        <label className="block text-gray-300 text-sm font-medium" htmlFor="price_female">
          Female Price (Kes)
        </label>
        <input
          id="price_female"
          type="number"
          placeholder="Female Price"
          value={formData.price_female}
          onChange={(e) => setFormData({ ...formData, price_female: e.target.value })}
          className="w-full p-2 bg-gray-800 text-white rounded-md"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-md">
          Cancel
        </button>
        <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Submit
        </button>
      </div>
    </div>
  </div>
);

export default PlansPage;