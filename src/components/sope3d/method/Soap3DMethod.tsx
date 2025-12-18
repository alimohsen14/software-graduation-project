import Soap3DMethodSteps from "./Soap3DMethodSteps";

function Soap3DMethod() {
  return (
    <section className="w-full bg-[#F7F4EF] py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <span className="text-sm uppercase tracking-wide text-[#3E6347] font-medium">
          The Method
        </span>

        <h2 className="mt-2 text-3xl md:text-4xl font-serif text-gray-900">
          From Olive to Cube
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-gray-600">
          The traditional process of soap making (Saboun) takes months to
          complete, following methods passed down through generations.
        </p>

        <div className="mt-12">
          <Soap3DMethodSteps />
        </div>
      </div>
    </section>
  );
}

export default Soap3DMethod;
