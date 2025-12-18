import Soap3DTimelineList from "./Soap3DTimelineList";

function Soap3DTimeline() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-serif text-gray-900">
          Through the Ages
        </h2>

        <div className="mt-14">
          <Soap3DTimelineList />
        </div>
      </div>
    </section>
  );
}

export default Soap3DTimeline;
