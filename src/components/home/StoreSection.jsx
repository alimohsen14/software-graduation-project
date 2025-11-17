import React from "react";

export default function StoreSection() {
  const products = [
    {
      id: 1,
      name: "Nablus Soap – Olive Oil",
      price: "$4.99",
      image: "/image.png",
    },
    {
      id: 2,
      name: "Traditional Clay Bowl",
      price: "$12.50",
      image: "/image.png",
    },
    {
      id: 3,
      name: "Heritage Print – Al Aqsa",
      price: "$19.99",
      image: "/image.png",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-10">
      {products.map((item) => (
        <div
          key={item.id}
          className="
            bg-[#eaf5ea] border border-emerald-800/10 rounded-xl 
            shadow-sm overflow-hidden cursor-pointer
            transition-all duration-300 
            hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg hover:bg-[#dff3e8]
          "
        >
          {/* Product Image */}
          <div className="h-36 bg-gray-200">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="font-semibold text-[#2f5c3f] text-sm mb-1">
              {item.name}
            </h3>

            <p className="text-[#2f5c3f] text-xs mb-2 opacity-80">
              {item.price}
            </p>

            <button
              className="
                px-3 py-1.5 rounded-lg bg-[#2f5c3f] text-white text-xs 
                hover:bg-[#244d33] transition
              "
            >
              View Product
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
