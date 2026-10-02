import { useEffect, useState } from "react";
import { deleteCrew, getAllCrew, updateCrewStatusBulk } from "@/api/crewApi";
import { Link } from "react-router";

interface Crew {
  _id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  email: string;
  contact: string;
  status: "active" | "on-leave" | "inactive";
}

const CrewList = () => {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCrews, setSelectedCrews] = useState<string[]>([]);

  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Helper function to get complete image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-avatar.png";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/${imagePath}`;
  };

  const fetchCrew = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== "all") filters.status = statusFilter;
      if (searchTerm) filters.search = searchTerm;
      
      const data = await getAllCrew(filters);
      setCrews(data.crew || data);
    } catch (error) {
      console.error("Failed to fetch crew:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrew();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCrew();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this crew member?",
    );
    if (!confirmDelete) return;

    try {
      await deleteCrew(id);
      setCrews((prev) => prev.filter((crew) => crew._id !== id));
    } catch (error) {
      console.error("Failed to delete crew:", error);
      alert("Failed to delete crew member");
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedCrews.length === 0) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      
      await updateCrewStatusBulk(selectedCrews, status, token);
      
      // Update UI
      setCrews(prev => prev.map(crew => 
        selectedCrews.includes(crew._id) ? { ...crew, status: status as any } : crew
      ));
      
      setSelectedCrews([]);
    } catch (error) {
      console.error("Failed to update bulk status:", error);
    }
  };

  const toggleSelectCrew = (id: string) => {
    setSelectedCrews(prev => 
      prev.includes(id) 
        ? prev.filter(crewId => crewId !== id)
        : [...prev, id]
    );
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    "on-leave": "bg-yellow-100 text-yellow-800",
    inactive: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    active: "Active",
    "on-leave": "On Leave",
    inactive: "Inactive",
  };

  if (loading && crews.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-lg text-gray-600">Loading crew members...</p>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-500 mt-1">Manage your team members here</p>
        </div>
        <Link
          to="/admin/crew/add"
          className="rounded-xl bg-[#8C3A22] px-6 py-3  font-semibold hover:bg-[#C2603A] transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span>+</span> Add New Member
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, position or email..."
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                🔍
              </div>
              <button type="submit" className="absolute right-2 top-2 bg-[#8C3A22]  px-4 py-1.5 rounded-md">
                Search
              </button>
            </div>
          </form>
          
          <div className="flex gap-4">
            <select
              className="p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
            
            {selectedCrews.length > 0 && (
              <div className="flex gap-2">
                <select
                  className="p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                  onChange={(e) => handleBulkStatusChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Update Status</option>
                  <option value="active">Set Active</option>
                  <option value="on-leave">Set On Leave</option>
                  <option value="inactive">Set Inactive</option>
                </select>
                <button
                  onClick={() => setSelectedCrews([])}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Selection Info */}
      {selectedCrews.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
          {selectedCrews.length} member(s) selected
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-left text-sm font-semibold text-gray-600 w-12">
                <input
                  type="checkbox"
                  checked={selectedCrews.length === crews.length && crews.length > 0}
                  onChange={() => {
                    if (selectedCrews.length === crews.length) {
                      setSelectedCrews([]);
                    } else {
                      setSelectedCrews(crews.map(c => c._id));
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Image</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Position</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {crews.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-lg">No team members found</p>
                    <p className="text-sm mt-1">Add your first team member by clicking "Add New Member"</p>
                  </div>
                </td>
              </tr>
            ) : (
              crews.map((crew) => (
                <tr key={crew._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedCrews.includes(crew._id)}
                      onChange={() => toggleSelectCrew(crew._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img 
                        src={getImageUrl(crew.image)} 
                        alt={crew.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-avatar.png";
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{crew.name}</div>
                    <div className="text-sm text-gray-500">{crew.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {crew.position}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[crew.status]}`}>
                      {statusLabels[crew.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <p className="text-gray-600 text-sm line-clamp-3">{crew.description}</p>
                      {crew.description && crew.description.length > 100 && (
                        <span className="text-xs text-gray-400 mt-1">...click edit to see more</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/crew/edit/${crew._id}`}
                        className="rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 font-medium transition-colors flex items-center gap-2"
                      >
                        <span>✏️</span> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(crew._id)}
                        className="rounded-lg bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 font-medium transition-colors flex items-center gap-2"
                      >
                        <span>🗑️</span> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      {crews.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#8C3A22] rounded-full"></div>
              <span className="text-sm text-gray-600">
                Total Members: <span className="font-bold">{crews.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Active: <span className="font-bold">{crews.filter(c => c.status === 'active').length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                On Leave: <span className="font-bold">{crews.filter(c => c.status === 'on-leave').length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Unique Positions: <span className="font-bold">{new Set(crews.map(c => c.position)).size}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewList;