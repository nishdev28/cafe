import { createCrew } from "@/api/crewApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCrew = () => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    contact: "",
    status: "active",
    description: "Team member description",
  });
  
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form data to send:", formData);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("description", formData.description);
      
      // Append image file if exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("Sending form data with file:", formDataToSend);

      // Update your API call to accept FormData
      const response = await createCrew(formDataToSend, token);
      
      console.log("Response:", response);
      
      toast.success("Crew member added successfully!");
      setTimeout(() => navigate("/admin/crew"), 1500);
      
    } catch (error: any) {
      console.error("Full error details:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
      }
      
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Server error: Please check backend logs"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/crew")}
            className="mb-4 flex items-center gap-2 text-gray-600"
          >
            ← Back to List
          </button>
          <h1 className="text-2xl font-bold">Add Crew Member</h1>
          <p className="text-gray-600">Add new team member with profile image</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div>
              <label className="block mb-1">Profile Image</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <div className="text-2xl mb-1">📷</div>
                        <div className="text-xs">No image</div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label 
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Image
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended: Square image, max 5MB
                    {imageFile && (
                      <span className="block text-green-600">
                        Selected: {imageFile.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Rest of the form fields remain the same */}
            <div>
              <label className="block mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block mb-1">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="Developer"
              />
            </div>

            <div>
              <label className="block mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block mb-1">Contact *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="1234567890"
              />
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border rounded"
                placeholder="Description..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600  p-3 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Crew Member"}
            </button>
          </form>
        </div>

       
      </div>
    </div>
  );
};

export default AddCrew;