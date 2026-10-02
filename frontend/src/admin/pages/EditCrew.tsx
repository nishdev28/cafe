import { getCrewById, updateCrew } from "@/api/crewApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditCrew = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    contact: "",
    status: "active",
    description: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("EditCrew component mounted");
    console.log("ID from URL params:", id);
  }, [id]);

  // Fetch crew data on component mount
  useEffect(() => {
    const fetchCrewData = async () => {
      if (!id) {
        console.error("No ID found in URL params");
        toast.error("Invalid crew member ID");
        navigate("/admin/crew");
        return;
      }
      
      console.log("Fetching crew data for ID:", id);
      
      try {
        setFetching(true);
        setError("");
        
        // Test API call first
        console.log("Making API call to:", `/crew/${id}`);
        
        const data = await getCrewById(id);
        
        console.log("✅ API Response received:", data);
        console.log("Data structure:", typeof data, Array.isArray(data));
        console.log("Full response:", JSON.stringify(data, null, 2));
        
        // Check if data is in nested structure
        const crewData = data.crew || data.data || data;
        
        if (!crewData || typeof crewData !== 'object') {
          throw new Error("Invalid data format received from server");
        }
        
        setFormData({
          name: crewData.name || "",
          position: crewData.position || "",
          email: crewData.email || "",
          contact: crewData.contact || "",
          status: crewData.status || "active",
          description: crewData.description || "",
        });
        
        if (crewData.image) {
          console.log("Setting image:", crewData.image);
          setCurrentImage(crewData.image);
          setImagePreview(crewData.image);
        } else {
          console.log("No image found for this crew member");
        }
        
      } catch (error: any) {
        console.error("❌ Failed to fetch crew data:", error);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Failed to load crew member data";
        
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`);
        
        // Don't navigate immediately, let user see the error
        // navigate("/admin/crew");
      } finally {
        setFetching(false);
      }
    };

    fetchCrewData();
  }, [id, navigate]);

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
    
    if (!id) {
      toast.error("Invalid crew member ID");
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("position", formData.position);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contact", formData.contact);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("description", formData.description);
      
      // Append image file only if a new one is selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("📤 Updating crew with ID:", id);
      console.log("Form data entries:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Update crew
      const response = await updateCrew(id, formDataToSend, token);
      
      console.log("✅ Update response:", response);
      
      toast.success("Crew member updated successfully!");
      setTimeout(() => navigate("/admin/crew"), 1500);
      
    } catch (error: any) {
      console.error("❌ Update error:", error);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        
        toast.error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          "Failed to update crew member"
        );
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crew member data...</p>
          <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate("/admin/crew")}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              ← Back to List
            </button>
            <h1 className="text-2xl font-bold text-red-600">Error Loading Crew Member</h1>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-bold text-red-700 mb-2">Troubleshooting Steps:</h3>
              <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                <li>Check if the crew member ID exists: {id}</li>
                <li>Verify your API endpoint is correct</li>
                <li>Check browser console for detailed error logs</li>
                <li>Make sure you're logged in with proper permissions</li>
              </ul>
            </div>
            
            <button
              onClick={() => navigate("/admin/crew")}
              className="mt-6 w-full bg-gray-600  p-3 rounded hover:bg-gray-700 transition-colors font-medium"
            >
              Return to Crew List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/crew")}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            ← Back to List
          </button>
          <h1 className="text-2xl font-bold">Edit Crew Member</h1>
          <p className="text-gray-600">Editing: {formData.name} (ID: {id})</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div>
              <label className="block mb-1 font-medium">Profile Image</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", imagePreview);
                          e.currentTarget.src = "/placeholder-avatar.png";
                        }}
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
                    className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors font-medium"
                  >
                    Change Image
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentImage && !imageFile && "Current image will be kept"}
                    {imageFile && (
                      <span className="block text-green-600 font-medium">
                        New image selected: {imageFile.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block mb-1 font-medium">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
                placeholder="Developer"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block mb-1 font-medium">Contact *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
                placeholder="1234567890"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-colors"
                placeholder="Description..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600  p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </span>
                ) : (
                  "Update Crew Member"
                )}
              </button>
            </div>
          </form>
        </div>

       
      </div>
    </div>
  );
};

export default EditCrew;