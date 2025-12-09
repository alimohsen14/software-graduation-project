import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProfileHeaderCard from '../components/profile/ProfileHeaderCard';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import SecurityCard from '../components/profile/SecurityCard';
import SellerAccountCard from '../components/profile/SellerAccountCard';
import AccountActivityCard from '../components/profile/AccountActivityCard';
import LogoutButton from '../components/profile/LogoutButton';
import EditProfileModal from '../components/profile/modals/EditProfileModal';
import ChangePasswordModal from '../components/profile/modals/ChangePasswordModal';
import { profileService } from '../services/profileService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  country: string;
  provider: string;
  isSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return navigate('/');

        const result = await profileService.getProfile();
        setUser(result);
      } catch (err: any) {
        console.log(err);
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const refreshProfile = async () => {
    try {
      const updated = await profileService.getProfile();
      setUser(updated);
    } catch {
      toast.error("Unable to refresh!");
    }
  };

  if (isLoading) {
    return <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-[#3e6347] text-white">
        Loading...
      </div>
    </DashboardLayout>;
  }

  if (!user) {
    return <DashboardLayout>
      <div className="flex items-center justify-center min-h-screen bg-[#3e6347] text-white">
        {error || "Something went wrong"}
      </div>
    </DashboardLayout>;
  }

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

            {user.isSeller && <SellerAccountCard />}

            <AccountActivityCard
              createdAt={user.createdAt}
              updatedAt={user.updatedAt}
            />

            <LogoutButton onLogout={profileService.logout} />
          </div>
        </div>
      </DashboardLayout>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={refreshProfile}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}