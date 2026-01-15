import React from "react";
import Soap3DModelViewer from "../components/soap3d/hero/Soap3DModelViewer";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Soap3DPage() {
  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <Soap3DModelViewer />
      </div>
    </DashboardLayout>
  );
}
