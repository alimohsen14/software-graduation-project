/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ---- Interfaces ----
interface UserProfile {
  id: number;
  name: string;
  email: string;
  country?: string;
  gender?: string;
  age?: number;
}

interface ProfileResponse {
  message: string;
  user: UserProfile;
}

// ---- Layout ----
import DashboardLayout from "../components/layout/DashboardLayout";

// ---- Components ----
import WelcomeCard from "../components/home/WelcomeCard";
import QuickActions from "../components/home/QuickActions";
import SectionTitle from "../components/home/SectionTitle";
import FeaturedModelsSection from "../components/home/FeaturedModelsSection";
import StoreSection from "../components/home/StoreSection";
import HeritageSection from "../components/home/HeritageSection";

export function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get<ProfileResponse>(
          "http://localhost:3000/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data.user);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#2f5c3f] text-lg">
        Loading user data...
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <WelcomeCard name={user?.name ?? "User"} />

      {/* Quick Access Buttons */}
      <QuickActions />

      {/* Featured 3D Models */}
      <SectionTitle text="Featured 3D Models" />
      <FeaturedModelsSection />

      {/* Official Store Products */}
      <SectionTitle text="From Our Store" />
      <StoreSection />

      {/* Heritage Section */}
      <SectionTitle text="Discover Our Heritage" />
      <HeritageSection />
    </DashboardLayout>
  );
}
