import { ReactNode } from "react";

interface Soap3DTimelineItemProps {
  icon: ReactNode;
  title: string;
  period: string;
  description: string;
}

function Soap3DTimelineItem(props: Soap3DTimelineItemProps) {
  return (
    <div className="relative">
      {/* Icon */}
      <div className="absolute -left-[38px] top-1 w-8 h-8 rounded-full bg-[#3E6347] flex items-center justify-center text-white">
        {props.icon}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-serif text-gray-900">{props.title}</h3>

          <span className="text-sm text-[#3E6347] font-medium">
            {props.period}
          </span>
        </div>

        <p className="mt-2 text-gray-600 leading-relaxed">
          {props.description}
        </p>
      </div>
    </div>
  );
}

export default Soap3DTimelineItem;
