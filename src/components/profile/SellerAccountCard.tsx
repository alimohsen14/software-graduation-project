import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function SellerAccountCard() {
  const navigate = useNavigate();

  const handleManageStore = () => {
    navigate('/seller/dashboard');
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-bold text-gray-900">
          Seller Account
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Access your seller dashboard and manage your products.
        </p>
      </div>
      <div>
        <button
          type="button"
          onClick={handleManageStore}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2f5c3f] text-[#FBF7EF] text-sm md:text-base font-semibold shadow-md hover:bg-[#274b34] focus:outline-none focus:ring-2 focus:ring-[#CDA15A]/30 transition"
        >
          Manage My Store
          <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
}