import React from "react";

export default function FeaturedModelsSection() {
  const models = [
    {
      id: 1,
      name: "Old Soap Factory",
      image: "/image.png",
    },
    {
      id: 2,
      name: "Historical Archway",
      image: "/image.png",
    },
    {
      id: 3,
      name: "Traditional Press Machine",
      image: "/image.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {models.map((model) => (
        <div
          key={model.id}
          className="
            bg-[#eaf5ea] border border-emerald-800/10 rounded-xl shadow-sm 
            overflow-hidden cursor-pointer
            transition-all duration-300
            hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]
          "
        >
          {/* Image */}
          <div className="h-40 bg-gray-200 overflow-hidden">
            <img
              src={model.image}
              alt={model.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-[#2f5c3f] mb-2">
              {model.name}
            </h3>

            <button
              className="
                px-4 py-2 rounded-lg bg-[#2f5c3f] text-white text-sm 
                hover:bg-[#244d33] transition
              "
            >
              View Model
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
