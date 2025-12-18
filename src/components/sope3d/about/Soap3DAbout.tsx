import Soap3DAboutImage from "./Soap3DAboutImage";
import Soap3DAboutContent from "./Soap3DAboutContent";

function Soap3DAbout() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <Soap3DAboutImage />
        <Soap3DAboutContent />
      </div>
    </section>
  );
}

export default Soap3DAbout;
