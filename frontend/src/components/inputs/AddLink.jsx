import React, { useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { toast } from "react-toastify";

const AddLink = ({ onClose, refreshLinks }) => {
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.url) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/add-link", formData);
      if (response.data?.message) {
        toast.success(response.data.message);
        refreshLinks(); // Refresh the list of links after adding
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error adding link:", error.message);
      toast.error("Failed to add link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Link</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Link Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Instagram"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Link URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="e.g., https://instagram.com"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-700"
          }`}
        >
          {loading ? "Adding..." : "Add Link"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 mt-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddLink;
