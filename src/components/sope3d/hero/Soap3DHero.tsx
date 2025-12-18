import Soap3DHeroHeader from "./Soap3DHeroHeader";
import Soap3DModelViewer from "./Soap3DModelViewer";
import Soap3DAskAiButton from "./Soap3DAskAiButton";

const Soap3DHero = () => {
  return (
    <section className="w-full bg-[#F7F4EF] py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-10">
        <Soap3DHeroHeader />
        <Soap3DModelViewer />
        <Soap3DAskAiButton />
      </div>
    </section>
  );
};

export default Soap3DHero;
