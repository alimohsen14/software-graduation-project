import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../components/layout/DashboardLayout";
import ProfileHeaderCard from "../components/profile/ProfileHeaderCard";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import SecurityCard from "../components/profile/SecurityCard";
import AccountActivityCard from "../components/profile/AccountActivityCard";
import LogoutButton from "../components/profile/LogoutButton";
import EditProfileModal from "../components/profile/modals/EditProfileModal";
import ChangePasswordModal from "../components/profile/modals/ChangePasswordModal";
import MyOrders from "../components/profile/MyOrders";

import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🌐 Toast errors (optional)
  useEffect(() => {
    if (location.state?.error) {
      toast.error(location.state.error);
    }
  }, [location]);

  // Guard ensures user exists
  if (!user) return null;

  return (
    <>
      <DashboardLayout>
        <div className="min-h-screen bg-[#3e6347] py-10 px-4">
          <div className="max-w-4xl mx-auto space-y-6">

            <ProfileHeaderCard {...user} />

            <ProfileInfoCard
              user={user}
              onEditClick={() => setIsEditModalOpen(true)}
              onChangePasswordClick={() => setIsPasswordModalOpen(true)}
            />

            <SecurityCard provider={user.provider} />

            {/* ===== SELLER LOGIC ===== */}
            {user.store?.type === "SELLER" ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">My Seller Dashboard</h3>
                  <p className="text-sm text-gray-500">
                    Manage your products and store
                  </p>
                  <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {user.store.name}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/seller")}
                    className="px-4 py-2 bg-[#4A6F5D] text-white rounded-lg"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigate("/seller/store")}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Store Settings
                  </button>
                </div>
              </div>
            ) : user.sellerRequest?.status === "PENDING" ? (
              <div className="bg-amber-50 p-6 rounded-xl border">
                <h3 className="font-bold text-amber-800">
                  Seller application under review
                </h3>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold">Become a Seller</h3>
                  <p className="text-sm text-gray-500">
                    Start selling on Palestine3D
                  </p>
                </div>
                <button
                  onClick={() => navigate("/become-seller")}
                  className="px-4 py-2 bg-[#4A6F5D] text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            )}

            <AccountActivityCard
              createdAt={user.createdAt}
              updatedAt={user.updatedAt}
            />

            <LogoutButton onLogout={logout} />

            {/* Orders Section */}
            <div className="pt-6 border-t border-white/20">
              <MyOrders />
            </div>
          </div>
        </div>
      </DashboardLayout>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={refreshUser}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}
