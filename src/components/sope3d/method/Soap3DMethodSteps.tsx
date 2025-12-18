import Soap3DMethodCard from "./Soap3DMethodCard";
import {
  FaLeaf,
  FaFireAlt,
  FaFillDrip,
  FaCut,
  FaLayerGroup,
} from "react-icons/fa";

function Soap3DMethodSteps() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Soap3DMethodCard
        icon={<FaLeaf />}
        title="Olive Oil"
        description="Sourcing premium virgin olive oil from local farms."
      />

      <Soap3DMethodCard
        icon={<FaFireAlt />}
        title="Cooking"
        description="Boiling the mixture in large copper vats for days."
      />

      <Soap3DMethodCard
        icon={<FaFillDrip />}
        title="Pouring"
        description="Spreading the liquid soap onto flat stone floors."
      />

      <Soap3DMethodCard
        icon={<FaCut />}
        title="Cutting"
        description="Manually shaping and cutting the soap into cubes."
      />

      <Soap3DMethodCard
        icon={<FaLayerGroup />}
        title="Drying"
        description="Stacking the cubes to dry and cure for months."
      />
    </div>
  );
}

export default Soap3DMethodSteps;
