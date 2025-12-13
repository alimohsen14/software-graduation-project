import React from "react";

interface LoadMoreButtonProps {
  onClick: () => void;
}

export default function LoadMoreButton({ onClick }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-12 pb-10">
      <button
        onClick={onClick}
        className="
          px-8 
          py-3 
          rounded-full 
          bg-red-600 
          text-white 
          font-bold 
          shadow-md
          hover:shadow-lg
          hover:bg-red-700
          transition
          transform
          hover:-translate-y-0.5
        "
      >
        Load More Products
      </button>
    </div>
  );
}
