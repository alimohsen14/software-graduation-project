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
