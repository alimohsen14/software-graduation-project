import React from "react";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export default function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-14 pb-10">
      <button
        onClick={onClick}
        className="
          px-8 
          py-3 
          rounded-full 
          bg-transparent
          border-2
          border-[#4A6F5D]
          text-[#4A6F5D] 
          font-bold 
          hover:bg-[#4A6F5D]
          hover:text-white
          transition-all
          duration-200
        "
      >
        Load More Products
      </button>
    </div>
  );
}
