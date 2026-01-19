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
        <div className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-10 animate-in fade-in duration-700">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <ProfileHeaderCard {...user} />

            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <ProfileInfoCard
                user={user}
                onEditClick={() => setIsEditModalOpen(true)}
                onChangePasswordClick={() => setIsPasswordModalOpen(true)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <SecurityCard provider={user.provider} />
                <AccountActivityCard
                  createdAt={user.createdAt}
                  updatedAt={user.updatedAt}
                />
              </div>

              {/* Orders Section */}
              <div className="pt-8 md:pt-12 border-t border-white/5 mx-2">
                <MyOrders />
              </div>

              <LogoutButton onLogout={logout} />
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
