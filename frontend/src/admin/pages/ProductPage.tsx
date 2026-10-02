import React, { useState, useEffect } from 'react';
import { type Product } from "@/types/products";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/api/products";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  // Get API base URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    weight: '',
    description: '',
    type: '',
    category: '',
    stock: 0,
    tags: [],
    isFeatured: false,
    status: 'draft',
    images: []
  });

  // Helper function to get complete image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith('http')) return imagePath;
    // Make sure to properly combine the base URL with the image path
    return `${API_BASE_URL}${imagePath}`;
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        tags: product.tags || []
      });
      setSelectedImages([]);
      setImageErrors({});
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        weight: '',
        description: '',
        type: '',
        category: '',
        stock: 0,
        tags: [],
        isFeatured: false,
        status: 'draft',
        images: []
      });
      setSelectedImages([]);
      setImageErrors({});
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
    }
  };

  const handleImageError = (imagePath: string, productId?: string) => {
    console.error("Image failed to load:", imagePath);
    if (productId) {
      setImageErrors(prev => ({ ...prev, [productId]: true }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productFormData = new FormData();
    
    // Add all form data
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof Product];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // For arrays like tags, send as JSON string
          productFormData.append(key, JSON.stringify(value));
        } else {
          productFormData.append(key, value.toString());
        }
      }
    });
    
    // Add images
    selectedImages.forEach((image) => {
      productFormData.append('images', image);
    });
    
    try {
      if (editingProduct) {
        // Update existing product
        const updated = await updateProduct(editingProduct.id, productFormData);
        if (updated) {
          setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        }
      } else {
        // Create new product
        const created = await addProduct(productFormData);
        if (created) {
          setProducts([...products, created]);
        }
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Delete ID received:", id);
    
    if (!id || id === 'undefined') {
      alert("Cannot delete: Invalid product ID");
      return;
    }
    
    const productToDelete = products.find(p => p.id === id);
    if (!productToDelete) {
      alert("Product not found!");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${productToDelete.name}"?`)) {
      try {
        console.log("Attempting delete...");
        const success = await deleteProduct(id);
        
        if (success) {
          console.log("Product deleted successfully");
          setProducts(products.filter(p => p.id !== id));
          
          // Also refresh from server to ensure consistency
          setTimeout(() => {
            fetchProducts();
          }, 500);
        } else {
          alert("Failed to delete product");
        }
      } catch (error: any) {
        console.error("Error deleting product:", error);
        
        // Check if the product is actually gone by looking in the current list
        setTimeout(async () => {
          try {
            const refreshedProducts = await getAllProducts();
            const productStillExists = refreshedProducts.some(p => p.id === id);
            
            if (!productStillExists) {
              // Product was deleted successfully despite the error
              console.log("Product was actually deleted successfully");
              setProducts(products.filter(p => p.id !== id));
            } else {
              alert("Product still exists. Delete may have failed.");
            }
          } catch (refreshError) {
            console.error("Error refreshing products:", refreshError);
          }
        }, 1000);
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products Inventory</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600  px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Weight</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={!imageErrors[product.id] && product.images?.[0] 
                        ? getImageUrl(product.images[0]) 
                        : "/placeholder.jpg"
                      } 
                      className="w-12 h-12 rounded-lg object-cover" 
                      alt={product.name}
                      onError={() => handleImageError(product.images?.[0] || '', product.id)}
                    />
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">
                    {product.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.weight}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">AED {product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : product.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">✏️</button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input 
                  required
                  type="text" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Classic Tiramisu"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED) *</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.price || 0}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.weight || ''}
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 250ml"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select 
                  required
                  value={formData.type || ''}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="large">Large (250ml)</option>
                  <option value="small">Small (150ml)</option>
                  <option value="box">Box</option>
                  <option value="casserole">Casserole</option>
                  <option value="minis">Minis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input 
                  type="text" 
                  value={formData.category || ''}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. desserts, beverages"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input 
                  type="number" 
                  value={formData.stock || 0}
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p>• Upload multiple images (first image will be used as thumbnail)</p>
                  <p>• Maximum file size: 5MB per image</p>
                </div>
                {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current Images:</p>
                    <div className="flex gap-2 flex-wrap">
                      {editingProduct.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img 
                            src={getImageUrl(img)} 
                            alt={`${editingProduct.name} ${idx + 1}`} 
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">New Images to Upload:</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedImages.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`New ${idx + 1}`} 
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                  onChange={e => setFormData({
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. premium, organic, vegan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={formData.status || 'draft'}
                  onChange={e => setFormData({...formData, status: e.target.value as Product['status']})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                  Featured Product
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  required
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                  placeholder="Enter product description..."
                />
              </div>
              
              <button type="submit" className="w-full bg-blue-600  py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all mt-4">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;