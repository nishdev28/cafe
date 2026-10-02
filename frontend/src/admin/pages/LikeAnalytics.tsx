import React, { useState, useEffect } from 'react';
import { 
  adminGetLikeStats, 
  adminGetProductLikes, 
  adminGetPowerUsers 
} from '@/api/like';
import { type LikeStatsResponse, type PowerUser } from '@/types/like';

const LikeAnalytics: React.FC = () => {
  const [stats, setStats] = useState<LikeStatsResponse | null>(null);
  const [powerUsers, setPowerUsers] = useState<PowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productLikes, setProductLikes] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsData, powerUsersData] = await Promise.all([
        adminGetLikeStats(),
        adminGetPowerUsers()
      ]);
      setStats(statsData);
      setPowerUsers(powerUsersData.powerUsers || []);
    } catch (error) {
      console.error("Failed to fetch like analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProductLikes = async (productId: string) => {
    try {
      const data = await adminGetProductLikes(productId);
      setProductLikes(data);
      setSelectedProductId(productId);
    } catch (error) {
      console.error("Failed to fetch product likes:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Like Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Likes</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats?.summary.totalLikes || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Products with Likes</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats?.summary.productsWithLikes || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            out of {stats?.summary.totalProducts} total
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Avg Likes/Product</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats?.summary.averageLikesPerProduct || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500"> Users</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {powerUsers.length}
          </p>
        </div>
      </div>

      {/* Top Liked Products */}
      {stats?.topLikedProducts && stats.topLikedProducts.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Liked Products</h3>
          <div className="space-y-4">
            {stats.topLikedProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">AED {product.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="block text-lg font-bold text-purple-600">{product.likeCount}</span>
                    <span className="text-xs text-gray-500">likes</span>
                  </div>
                  <button
                    onClick={() => handleViewProductLikes(product.id)}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm hover:bg-purple-200"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Power Users */}
      {powerUsers.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
          <div className="space-y-4">
            {powerUsers.map((item, index) => (
              <div key={item.user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{item.user.username}</p>
                    <p className="text-sm text-gray-500">{item.user.email}</p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-amber-600">{item.totalLikes}</span>
                  <span className="text-xs text-gray-500">products liked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Likes Modal */}
      {productLikes && selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{productLikes.product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Total Likes: {productLikes.product.totalLikes}
                </p>
              </div>
              <button 
                onClick={() => {
                  setProductLikes(null);
                  setSelectedProductId(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {productLikes.likedBy && productLikes.likedBy.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">Username</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">Role</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-600">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productLikes.likedBy.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium">{user.username}</td>
                        <td className="p-3 text-sm text-gray-600">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'crew'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-8">No likes yet for this product</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeAnalytics;