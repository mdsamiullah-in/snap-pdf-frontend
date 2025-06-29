import React, { useState, useEffect } from "react";
import http from "../util/http";
import useSWR from "swr";
import { useNavigate, useLocation } from "react-router-dom";
import fetcher from "../util/fetcher";
import Swal from "sweetalert2";

const Plan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [plan, setPlan] = useState({
    name: "",
    price: "",
    credits: "",
    note: "",
  });

  const {
    data: session,
    isLoading: sessionLoading,
  } = useSWR("/api/user/session", fetcher);

  // Redirect non-admins
  useEffect(() => {
    if (!sessionLoading && (!session || session.role !== "admin")) {
      navigate("/unauthorized");
    }
  }, [session, sessionLoading, navigate]);

  // Fetch all plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await http.get("/api/plan");
        setPlans(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("❌ Failed to fetch plans:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load plans. Please try again.",
        });
      }
    };
    fetchPlans();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      try {
        const res = await http.put(`/api/plan/${editingId}`, plan);
        Swal.fire("✅ Plan Updated!", "", "success");
        setPlans((prev) =>
          prev.map((p) => (p._id === editingId ? res.data.data : p))
        );
        resetForm();
      } catch (err) {
        console.error("❌ Update error:", err);
        Swal.fire("❌ Failed to update plan", "Please try again", "error");
      }
    } else {
      try {
        const res = await http.post("/api/plan", plan);
        Swal.fire("✅ Plan Created!", "", "success");
        setPlans((prev) => [...prev, res.data.data]);
        resetForm();
      } catch (err) {
        console.error("❌ Creation error:", err);
        Swal.fire("❌ Failed to create plan", "Please try again", "error");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setPlan({ name: "", price: "", credits: "", note: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  // Handle edit button
  const handleEdit = (plan) => {
    setPlan({
      name: plan.name,
      price: plan.price,
      credits: plan.credits,
      note: plan.note,
    });
    setIsEditing(true);
    setEditingId(plan._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete plan
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This plan will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoadingPlanId(id);
      await http.delete(`/api/plan/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      Swal.fire("Deleted!", "Plan has been deleted.", "success");
    } catch (err) {
      console.error("❌ Delete error:", err);
      Swal.fire("❌ Failed to delete plan", "Please try again", "error");
    } finally {
      setLoadingPlanId(null);
    }
  };

  if (sessionLoading || !session) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center space-y-8">
      {/* Create/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-md"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          {isEditing ? "Edit Plan" : "Create Plan"}
        </h2>

        {["name", "price", "credits", "note"].map((field, index) => (
          <div key={index}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
              {field === "note"
                ? "Note-Taking Limit"
                : field === "credits"
                ? "PDF Upload Limit"
                : field}
            </label>
            <input
              id={field}
              type={field === "price" || field === "credits" ? "number" : "text"}
              name={field}
              placeholder={
                field === "name"
                  ? "Pro, Premium"
                  : field === "price"
                  ? "399"
                  : field === "credits"
                  ? "100"
                  : "Unlimited"
              }
              value={plan[field]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none"
              required={field !== "note"}
            />
          </div>
        ))}

        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            {isEditing ? "Update Plan" : "Create Plan"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Plans Table */}
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">All Plans</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Price (₹)</th>
                <th className="px-4 py-2">Credits</th>
                <th className="px-4 py-2">Note Limit</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No plans available.
                  </td>
                </tr>
              ) : (
                plans.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.price}</td>
                    <td className="px-4 py-2">{p.credits}</td>
                    <td className="px-4 py-2">{p.note}</td>
                    <td className="px-4 py-2 flex gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={loadingPlanId === p._id}
                        className="text-red-600 hover:underline text-sm disabled:opacity-50"
                      >
                        {loadingPlanId === p._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Plan;
