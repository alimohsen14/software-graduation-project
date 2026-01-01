import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import WelcomeCard from "../components/home/WelcomeCard";
import QuickActions from "../components/home/QuickActions";
import SectionTitle from "../components/home/SectionTitle";
import FeaturedModelsSection from "../components/home/FeaturedModelsSection";
import StoreSection from "../components/home/StoreSection";
import HeritageSection from "../components/home/HeritageSection";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();

  // Guard ensures user exists, but for TS safety:
  if (!user) return null;

  return (
    <DashboardLayout>
      <>
        <WelcomeCard name={user.name} />
        <QuickActions />
        <SectionTitle text="Featured 3D Models" />
        <FeaturedModelsSection />
        <StoreSection />
        <HeritageSection />
      </>
    </DashboardLayout>
  );
}