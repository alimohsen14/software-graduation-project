import Soap3DTimelineItem from "./Soap3DTimelineItem";
import { FaSeedling, FaCrown, FaShieldAlt } from "react-icons/fa";

function Soap3DTimelineList() {
  return (
    <div className="relative border-l-2 border-[#E6EFE8] pl-8 space-y-12">
      <Soap3DTimelineItem
        icon={<FaSeedling />}
        title="Origins"
        period="10th Century"
        description="Early records indicate soap production in Nablus began, utilizing the region’s abundant olive oil supplies."
      />

      <Soap3DTimelineItem
        icon={<FaCrown />}
        title="Ottoman Golden Era"
        period="19th Century"
        description="Nablus became a major soap manufacturing center, exporting soap across the Middle East and Europe."
      />

      <Soap3DTimelineItem
        icon={<FaShieldAlt />}
        title="Modern Resilience"
        period="21st Century"
        description="Despite challenges, remaining factories continue to produce by hand, preserving Nablus’s cultural identity."
      />
    </div>
  );
}

export default Soap3DTimelineList;
