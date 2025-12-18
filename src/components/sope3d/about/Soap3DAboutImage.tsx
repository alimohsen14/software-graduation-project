function Soap3DAboutImage() {
  return (
    <div className="relative">
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <img
          src="/images/soap-stack.jpg"
          alt="Nablus Soap"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Caption */}
      <div className="absolute -bottom-6 left-6 bg-white px-4 py-2 rounded-md shadow text-sm text-gray-600">
        The soap of Nablus is born from olive oil and tradition.
      </div>
    </div>
  );
}

export default Soap3DAboutImage;
