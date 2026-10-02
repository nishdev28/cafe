import React, { useState, useEffect } from 'react';
import { type Testimonial } from "@/types/api"
import { getAllTestimonials, createTestimonial } from "@/api/testimonals";

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    content: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch testimonials from API
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      content: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const testimonialData = {
        name: formData.name || '',
        content: formData.content || '',
        rating: formData.rating || 5,
        date: formData.date || new Date().toISOString().split('T')[0]
      };

      const newTestimonial = await createTestimonial(testimonialData);
      
      if (newTestimonial) {
        // Add the new testimonial to the list
        setTestimonials([...testimonials, newTestimonial]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Customer Testimonials</h2>
          <button 
            onClick={handleOpenModal}
            className="bg-blue-600  px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            + Add Testimonial
          </button>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Loading testimonials...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customer Testimonials</h2>
        <button 
          onClick={handleOpenModal}
          className="bg-blue-600  px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          + Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t._id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1 text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < t.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">"{t.content}"</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">
                  {t.date ? new Date(t.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No testimonials yet. Add your first testimonial!</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Testimonial</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <input 
                  required
                  type="number" 
                  min="1" 
                  max="5"
                  value={formData.rating}
                  onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  placeholder="What did they say?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600  py-4 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4"
              >
                Add Testimonial
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;