import { ReactNode } from "react";

interface Soap3DMethodCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function Soap3DMethodCard(props: Soap3DMethodCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#E6EFE8] text-[#3E6347] text-xl">
        {props.icon}
      </div>

      <h3 className="mt-4 font-serif text-lg text-gray-900">{props.title}</h3>

      <p className="mt-2 text-sm text-gray-600">{props.description}</p>
    </div>
  );
}

export default Soap3DMethodCard;
