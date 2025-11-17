import React from "react";

export default function HeritageSection() {
  const heritage = [
    {
      id: 1,
      title: "Al-Aqsa Compound",
      description: "A historic and sacred site in the Old City of Jerusalem.",
      image: "/placeholder-heritage.png",
    },
    {
      id: 2,
      title: "The Old City",
      description: "A symbol of culture, identity, and Palestinian history.",
      image: "/placeholder-heritage.png",
    },
    {
      id: 3,
      title: "Nablus Old Market",
      description: "One of the oldest traditional markets in Palestine.",
      image: "/placeholder-heritage.png",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {heritage.map((item) => (
        <div
          key={item.id}
          className="
            bg-[#eaf5ea] border border-emerald-800/10 rounded-xl 
            shadow-sm overflow-hidden cursor-pointer
            transition-all duration-300 
            hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:bg-[#dff3e8]
          "
        >
          {/* Image */}
          <div className="h-40 bg-gray-200">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-[#2f5c3f] mb-1">
              {item.title}
            </h3>

            <p className="text-[#2f5c3f]/80 text-sm">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
