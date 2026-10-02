import { useEffect, useState } from "react";
import Image from "../ui/Image";
import { getAllCrew } from "@/api/crewApi";

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  contact?: string;
  email?: string;
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Helper function to get complete image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-avatar.png";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Only fetch active team members
        const data = await getAllCrew({ status: 'active' });
        setTeamMembers(data.crew || data);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-600">Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8">
      <h4 className="text-gray-800 mb-10 text-3xl md:text-4xl lg:text-5xl text-center font-bold">
        Meet Our Team
      </h4>

      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No team members to display</p>
            <p className="text-gray-500">Add team members from the admin panel</p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member._id}
              className="perspective w-[22rem] h-[28rem] cursor-pointer group"
            >
              <div className="flip-inner w-full h-full relative">
                {/* FRONT */}
                <div className="flip-front absolute w-full h-full">
                  <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-avatar.png";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h5 className=" text-xl font-bold">{member.name}</h5>
                      <p className="/90 text-sm">{member.position}</p>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className="flip-back bg-gradient-to-br from-[#8C3A22] to-[#5C2414]  rounded-2xl
                              flex flex-col items-center justify-center
                              p-6 text-center shadow-lg">
                  <h5 className="text-2xl font-bold mb-2">{member.name}</h5>
                  <p className="text-sm mb-6 opacity-90 bg-white/10 px-4 py-1 rounded-full">
                    {member.position}
                  </p>
                  <p className="text-sm italic mb-4 line-clamp-4">
                    "{member.description}"
                  </p>
                  {member.contact && (
                    <p className="text-sm mt-2 opacity-80">
                      📞 {member.contact}
                    </p>
                  )}
                  {member.email && (
                    <p className="text-sm opacity-80">
                      ✉️ {member.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

     
    </div>
  );
}