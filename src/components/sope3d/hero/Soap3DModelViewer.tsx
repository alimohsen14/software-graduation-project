import { FaCube } from "react-icons/fa";

const Soap3DModelViewer = () => {
  return (
    <div className="w-full max-w-5xl">
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-200 aspect-video flex items-center justify-center">
        {/* Placeholder Icon */}
        <FaCube className="text-6xl text-gray-400" />

        {/* Overlay Button */}
        <button className="absolute flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
          <FaCube className="text-[#3E6347]" />
          Click to load 3D factory model
        </button>

        {/* Controls (UI only) */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-gray-600 hover:bg-gray-100">
            +
          </button>
          <button className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-gray-600 hover:bg-gray-100">
            −
          </button>
          <button className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center text-gray-600 hover:bg-gray-100">
            ⟳
          </button>
        </div>
      </div>
    </div>
  );
};

export default Soap3DModelViewer;
