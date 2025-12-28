import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import SecurityCard from '../components/profile/SecurityCard';
// import SellerAccountCard from '../components/profile/SellerAccountCard'; // Seems unused in strict logic below
import AccountActivityCard from '../components/profile/AccountActivityCard';
import LogoutButton from '../components/profile/LogoutButton';
import EditProfileModal from '../components/profile/modals/EditProfileModal';
import ChangePasswordModal from '../components/profile/modals/ChangePasswordModal';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      toast.error(location.state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (authLoading) {
    return <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-[#3e6347] text-white">
        Loading...
      </div>
    </DashboardLayout>;
  }

  if (!user) {
    return <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-[#3e6347] text-white">
        Please log in to view your profile.
      </div>
    </DashboardLayout>;
  }

  // Debugging
  console.log({
    userStore: user.store,
    // sellerRequestStatus: user.sellerRequest?.status // Not available in User type currently, relying on store state
    sellerRequestStatus: user.sellerRequest?.status,
    type: user.store?.type
  });

  return (
    <>
      <DashboardLayout>
        <div className="min-h-screen bg-[#3e6347] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">

            <ProfileHeaderCard {...user} />

            <ProfileInfoCard
              user={user}
              onEditClick={() => setIsEditModalOpen(true)}
              onChangePasswordClick={() => setIsPasswordModalOpen(true)}
            />

            <SecurityCard provider={user.provider} />

            {/* SELLER LOGIC - STRICT PRIORITY */}
            {user.store?.type === "SELLER" ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1d2d1f]">My Seller Dashboard</h3>
                    <p className="text-sm text-gray-500">
                      Manage your products, orders, and store settings.
                    </p>
                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {user.store?.name || "My Store"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/seller")}
                  className="px-5 py-2.5 bg-[#4A6F5D] text-white text-sm font-bold rounded-xl hover:bg-[#3d5c4d] transition shadow-sm"
                >
                  Seller Dashboard
                </button>
                <button
                  onClick={() => navigate("/seller/store")}
                  className="ml-3 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition shadow-sm"
                >
                  Store Settings
                </button>
              </div>
            ) : user.sellerRequest?.status === "PENDING" ? (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-center gap-4">
                <div className="text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-800">Application Under Review</h3>
                  <p className="text-sm text-amber-700">
                    Your application to become a seller is currently being reviewed by our admins. We will notify you once it's approved.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1d2d1f]">Become a Seller</h3>
                  <p className="text-sm text-gray-500">
                    Start selling your products on Palestine3D marketplace.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/become-seller")}
                  className="px-5 py-2 bg-[#4A6F5D] text-white text-sm font-bold rounded-lg hover:bg-[#3d5c4d] transition"
                >
                  Apply Now
                </button>
              </div>
            )}

            <AccountActivityCard
              createdAt={user.createdAt}
              updatedAt={user.updatedAt}
            />

            <LogoutButton onLogout={logout} />
          </div >
        </div >
      </DashboardLayout >

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        // @ts-ignore
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